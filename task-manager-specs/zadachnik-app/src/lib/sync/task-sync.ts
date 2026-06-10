import { prisma } from "@/lib/db";
import {
  cleanText,
  optionalIdList,
  requireTitle,
  validateTaskPatch,
  type TaskInput
} from "@/lib/tasks/task-validation";
import { taskDetailInclude, taskInclude } from "@/lib/tasks/task-queries";
import { shouldBumpCalendarSequence } from "@/lib/calendar/task-calendar";

export type SyncOperation =
  | "task.create"
  | "task.patch"
  | "task.archive"
  | "task.note.create";

export type SyncMutation = {
  clientMutationId: string;
  operation: SyncOperation;
  taskId?: string;
  localTaskId?: string;
  payload?: Record<string, unknown>;
  clientUpdatedAt: string;
};

export type SyncMutationResult = {
  clientMutationId: string;
  operation: SyncOperation;
  status: "applied" | "duplicate" | "ignored_stale" | "failed";
  taskId?: string;
  localTaskId?: string;
  error?: string;
};

function parseMutationDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Некорректная дата изменения.");
  }

  return date;
}

function resultJson(result: SyncMutationResult) {
  return JSON.stringify(result);
}

function parseDuplicateResult(
  mutation: SyncMutation,
  result: string | null
): SyncMutationResult {
  if (!result) {
    return {
      clientMutationId: mutation.clientMutationId,
      operation: mutation.operation,
      status: "duplicate",
      taskId: mutation.taskId,
      localTaskId: mutation.localTaskId
    };
  }

  return {
    ...(JSON.parse(result) as SyncMutationResult),
    status: "duplicate"
  };
}

async function recordMutation(
  mutation: SyncMutation,
  clientUpdatedAt: Date,
  result: SyncMutationResult
) {
  await prisma.appliedMutation.update({
    where: { clientMutationId: mutation.clientMutationId },
    data: {
      clientMutationId: mutation.clientMutationId,
      operation: mutation.operation,
      entityType: mutation.operation.startsWith("task.") ? "task" : null,
      entityId: result.taskId ?? mutation.taskId ?? null,
      localEntityId: mutation.localTaskId ?? null,
      clientUpdatedAt,
      resultJson: resultJson(result)
    }
  });
}

async function reserveMutation(mutation: SyncMutation, clientUpdatedAt: Date) {
  try {
    await prisma.appliedMutation.create({
      data: {
        clientMutationId: mutation.clientMutationId,
        operation: mutation.operation,
        entityType: mutation.operation.startsWith("task.") ? "task" : null,
        entityId: mutation.taskId ?? null,
        localEntityId: mutation.localTaskId ?? null,
        clientUpdatedAt
      }
    });
    return null;
  } catch {
    return prisma.appliedMutation.findUnique({
      where: { clientMutationId: mutation.clientMutationId }
    });
  }
}

async function resolveTaskId(mutation: SyncMutation) {
  const directId = cleanText(mutation.taskId);

  if (directId) {
    return { id: directId, localCreatedAt: null as Date | null };
  }

  const localId = cleanText(mutation.localTaskId);

  if (!localId) {
    return { id: null, localCreatedAt: null as Date | null };
  }

  const appliedCreate = await prisma.appliedMutation.findFirst({
    where: {
      localEntityId: localId,
      entityType: "task",
      entityId: { not: null }
    },
    orderBy: { serverAppliedAt: "desc" }
  });

  return {
    id: appliedCreate?.entityId ?? null,
    localCreatedAt: appliedCreate?.clientUpdatedAt ?? null
  };
}

async function createTask(mutation: SyncMutation, clientUpdatedAt: Date) {
  const payload = (mutation.payload ?? {}) as TaskInput;
  const title = requireTitle(payload.title);
  const data = validateTaskPatch(payload);
  const contextIds = "contextIds" in payload ? optionalIdList(payload.contextIds) : [];

  delete data.title;

  if (typeof data.waitingDirection === "string") {
    data.waitingSince = clientUpdatedAt;
  }

  const task = await prisma.$transaction(async (tx) => {
    const created = await tx.task.create({
      data: {
        ...data,
        title,
        status: typeof data.status === "string" ? data.status : "inbox"
      }
    });

    if (contextIds.length > 0) {
      await tx.taskContext.createMany({
        data: Array.from(new Set(contextIds)).map((contextId) => ({
          taskId: created.id,
          contextId
        }))
      });
    }

    return tx.task.findUniqueOrThrow({
      where: { id: created.id },
      include: taskDetailInclude
    });
  });

  return {
    result: {
      clientMutationId: mutation.clientMutationId,
      operation: mutation.operation,
      status: "applied",
      taskId: task.id,
      localTaskId: mutation.localTaskId
    } satisfies SyncMutationResult,
    task
  };
}

async function patchTask(mutation: SyncMutation, clientUpdatedAt: Date) {
  const resolved = await resolveTaskId(mutation);
  const id = resolved.id;

  if (!id) {
    throw new Error("Не найдена задача для синхронизации.");
  }

  const current = await prisma.task.findUnique({
    where: { id },
    include: taskDetailInclude
  });

  if (!current) {
    throw new Error("Задача не найдена.");
  }

  const staleBoundary = resolved.localCreatedAt ?? current.updatedAt;

  if (clientUpdatedAt < staleBoundary) {
    return {
      result: {
        clientMutationId: mutation.clientMutationId,
        operation: mutation.operation,
        status: "ignored_stale",
        taskId: id,
        localTaskId: mutation.localTaskId
      } satisfies SyncMutationResult,
      task: current
    };
  }

  const payload = (mutation.payload ?? {}) as TaskInput;
  const contextIds = "contextIds" in payload ? optionalIdList(payload.contextIds) : undefined;
  const data = validateTaskPatch(payload);
  const bumpCalendarSequence = shouldBumpCalendarSequence(data);

  const task = await prisma.$transaction(async (tx) => {
    if ("status" in data || "waitingDirection" in data) {
      const previous = await tx.task.findUnique({
        where: { id },
        select: {
          completedAt: true,
          waitingDirection: true,
          waitingSince: true
        }
      });

      if (data.status === "done") {
        data.completedAt = previous?.completedAt ?? clientUpdatedAt;
      } else if ("status" in data) {
        data.completedAt = null;
      }

      if (typeof data.waitingDirection === "string") {
        data.waitingSince =
          previous?.waitingDirection === data.waitingDirection && previous.waitingSince
            ? previous.waitingSince
            : clientUpdatedAt;
      } else if ("waitingDirection" in data) {
        data.waitingSince = null;
      }
    }

    if (contextIds) {
      await tx.taskContext.deleteMany({ where: { taskId: id } });

      if (contextIds.length > 0) {
        await tx.taskContext.createMany({
          data: Array.from(new Set(contextIds)).map((contextId) => ({ taskId: id, contextId }))
        });
      }
    }

    if (bumpCalendarSequence) {
      await tx.taskCalendarLink.updateMany({
        where: { taskId: id },
        data: {
          sequence: { increment: 1 },
          lastSyncedAt: new Date()
        }
      });
    }

    return tx.task.update({
      where: { id },
      data,
      include: taskDetailInclude
    });
  });

  return {
    result: {
      clientMutationId: mutation.clientMutationId,
      operation: mutation.operation,
      status: "applied",
      taskId: task.id,
      localTaskId: mutation.localTaskId
    } satisfies SyncMutationResult,
    task
  };
}

async function archiveTask(mutation: SyncMutation, clientUpdatedAt: Date) {
  const resolved = await resolveTaskId(mutation);
  const id = resolved.id;

  if (!id) {
    throw new Error("Не найдена задача для синхронизации.");
  }

  const current = await prisma.task.findUnique({
    where: { id },
    include: taskDetailInclude
  });

  if (!current) {
    throw new Error("Задача не найдена.");
  }

  const staleBoundary = resolved.localCreatedAt ?? current.updatedAt;

  if (clientUpdatedAt < staleBoundary) {
    return {
      result: {
        clientMutationId: mutation.clientMutationId,
        operation: mutation.operation,
        status: "ignored_stale",
        taskId: id,
        localTaskId: mutation.localTaskId
      } satisfies SyncMutationResult,
      task: current
    };
  }

  const task = await prisma.task.update({
    where: { id },
    data: { archivedAt: clientUpdatedAt },
    include: taskDetailInclude
  });

  return {
    result: {
      clientMutationId: mutation.clientMutationId,
      operation: mutation.operation,
      status: "applied",
      taskId: task.id,
      localTaskId: mutation.localTaskId
    } satisfies SyncMutationResult,
    task
  };
}

async function createNote(mutation: SyncMutation) {
  const resolved = await resolveTaskId(mutation);
  const id = resolved.id;
  const body = cleanText(mutation.payload?.body);

  if (!id) {
    throw new Error("Не найдена задача для заметки.");
  }

  if (!body) {
    throw new Error("Введите текст заметки.");
  }

  await prisma.taskNote.create({
    data: {
      taskId: id,
      body
    }
  });

  const task = await prisma.task.findUniqueOrThrow({
    where: { id },
    include: taskDetailInclude
  });

  return {
    result: {
      clientMutationId: mutation.clientMutationId,
      operation: mutation.operation,
      status: "applied",
      taskId: id,
      localTaskId: mutation.localTaskId
    } satisfies SyncMutationResult,
    task
  };
}

export async function applySyncMutation(mutation: SyncMutation) {
  const duplicate = await prisma.appliedMutation.findUnique({
    where: { clientMutationId: mutation.clientMutationId }
  });

  if (duplicate) {
    return { result: parseDuplicateResult(mutation, duplicate.resultJson), task: null };
  }

  const clientUpdatedAt = parseMutationDate(mutation.clientUpdatedAt);

  const reservedDuplicate = await reserveMutation(mutation, clientUpdatedAt);

  if (reservedDuplicate) {
    return { result: parseDuplicateResult(mutation, reservedDuplicate.resultJson), task: null };
  }

  try {
    let applied:
      | Awaited<ReturnType<typeof createTask>>
      | Awaited<ReturnType<typeof patchTask>>
      | Awaited<ReturnType<typeof archiveTask>>
      | Awaited<ReturnType<typeof createNote>>;

    if (mutation.operation === "task.create") {
      applied = await createTask(mutation, clientUpdatedAt);
    } else if (mutation.operation === "task.patch") {
      applied = await patchTask(mutation, clientUpdatedAt);
    } else if (mutation.operation === "task.archive") {
      applied = await archiveTask(mutation, clientUpdatedAt);
    } else if (mutation.operation === "task.note.create") {
      applied = await createNote(mutation);
    } else {
      throw new Error("Неизвестный тип изменения.");
    }

    await recordMutation(mutation, clientUpdatedAt, applied.result);
    return applied;
  } catch (error) {
    const result: SyncMutationResult = {
      clientMutationId: mutation.clientMutationId,
      operation: mutation.operation,
      status: "failed",
      taskId: mutation.taskId,
      localTaskId: mutation.localTaskId,
      error: error instanceof Error ? error.message : "Не удалось синхронизировать."
    };

    await recordMutation(mutation, clientUpdatedAt, result);
    return { result, task: null };
  }
}

export async function getOpenTasksForSync() {
  return prisma.task.findMany({
    where: {
      archivedAt: null,
      status: { not: "done" }
    },
    include: taskInclude,
    orderBy: [{ createdAt: "desc" }]
  });
}
