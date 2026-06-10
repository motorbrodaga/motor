"use client";

import type { TaskView } from "@/features/tasks/task-types";
import {
  addQueuedMutation,
  archiveCachedTask,
  buildLocalTask,
  patchCachedTask,
  saveCachedTasks,
  upsertCachedTask,
  type OfflineOperation,
  type QueuedMutation
} from "@/features/offline/offline-store";

type OfflineTaskResult = {
  queued: boolean;
  task?: TaskView;
};

function online() {
  return typeof navigator === "undefined" || navigator.onLine;
}

function mutationId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `mutation-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function localId() {
  return `local-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function shouldQueue(error: unknown) {
  if (!online()) {
    return true;
  }

  return error instanceof TypeError;
}

async function readApiError(response: Response, fallback: string) {
  const payload = (await response.json().catch(() => ({}))) as { error?: string };
  return payload.error ?? fallback;
}

async function queueMutation(
  operation: OfflineOperation,
  payload: Record<string, unknown> | undefined,
  taskId?: string,
  localTaskId?: string
) {
  const mutation: QueuedMutation = {
    clientMutationId: mutationId(),
    operation,
    taskId,
    localTaskId,
    payload,
    clientUpdatedAt: new Date().toISOString()
  };

  await addQueuedMutation(mutation);
  return mutation;
}

export async function createTask(body: Record<string, unknown>): Promise<OfflineTaskResult> {
  try {
    if (!online()) {
      throw new TypeError("offline");
    }

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(await readApiError(response, "Проверьте поля и попробуйте еще раз."));
    }

    const payload = (await response.json()) as { task: TaskView };
    await upsertCachedTask(payload.task);
    return { queued: false, task: payload.task };
  } catch (error) {
    if (!shouldQueue(error)) {
      throw error;
    }

    const id = localId();
    const task = buildLocalTask(body, id);

    await upsertCachedTask(task);
    await queueMutation("task.create", body, undefined, id);
    return { queued: true, task };
  }
}

export async function patchTask(
  taskId: string,
  body: Record<string, unknown>
): Promise<OfflineTaskResult> {
  try {
    if (!online() || taskId.startsWith("local-")) {
      throw new TypeError("offline");
    }

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(await readApiError(response, "Не удалось сохранить задачу."));
    }

    const payload = (await response.json()) as { task: TaskView };
    await upsertCachedTask(payload.task);
    return { queued: false, task: payload.task };
  } catch (error) {
    if (!shouldQueue(error) && !taskId.startsWith("local-")) {
      throw error;
    }

    await patchCachedTask(taskId, body);
    await queueMutation("task.patch", body, taskId.startsWith("local-") ? undefined : taskId, taskId);
    return { queued: true };
  }
}

export async function archiveTask(taskId: string): Promise<OfflineTaskResult> {
  try {
    if (!online() || taskId.startsWith("local-")) {
      throw new TypeError("offline");
    }

    const response = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });

    if (!response.ok) {
      throw new Error("Не удалось скрыть задачу.");
    }

    await archiveCachedTask(taskId);
    return { queued: false };
  } catch (error) {
    if (!shouldQueue(error) && !taskId.startsWith("local-")) {
      throw error;
    }

    await archiveCachedTask(taskId);
    await queueMutation("task.archive", undefined, taskId.startsWith("local-") ? undefined : taskId, taskId);
    return { queued: true };
  }
}

export async function createTaskNote(taskId: string, body: string): Promise<OfflineTaskResult> {
  try {
    if (!online() || taskId.startsWith("local-")) {
      throw new TypeError("offline");
    }

    const response = await fetch(`/api/tasks/${taskId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body })
    });

    if (!response.ok) {
      throw new Error(await readApiError(response, "Не удалось добавить заметку."));
    }

    return { queued: false };
  } catch (error) {
    if (!shouldQueue(error) && !taskId.startsWith("local-")) {
      throw error;
    }

    await queueMutation("task.note.create", { body }, taskId.startsWith("local-") ? undefined : taskId, taskId);
    return { queued: true };
  }
}

export async function refreshCachedTasks(tasks: TaskView[]) {
  await saveCachedTasks(tasks);
}
