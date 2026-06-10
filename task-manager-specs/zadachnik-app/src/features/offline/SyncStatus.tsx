"use client";

import { useEffect, useState } from "react";
import {
  countQueuedMutations,
  getQueuedMutations,
  removeQueuedMutations,
  saveCachedTasks,
  upsertCachedTask
} from "@/features/offline/offline-store";
import type { TaskView } from "@/features/tasks/task-types";

type SyncPayload = {
  results: Array<{
    clientMutationId: string;
    status: "applied" | "duplicate" | "ignored_stale" | "failed";
    taskId?: string;
    localTaskId?: string;
  }>;
  changedTasks?: TaskView[];
  tasks?: TaskView[];
};

export function SyncStatus() {
  const [online, setOnline] = useState(true);
  const [queued, setQueued] = useState(0);
  const [syncing, setSyncing] = useState(false);
  const [needsAttention, setNeedsAttention] = useState(false);

  async function refreshCount() {
    setQueued(await countQueuedMutations());
  }

  async function flushQueue() {
    if (syncing || typeof navigator !== "undefined" && !navigator.onLine) {
      return;
    }

    const mutations = await getQueuedMutations();

    if (mutations.length === 0) {
      await refreshCount();
      return;
    }

    setSyncing(true);
    setNeedsAttention(false);

    try {
      const response = await fetch("/api/sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mutations })
      });

      if (!response.ok) {
        throw new Error("sync failed");
      }

      const payload = (await response.json()) as SyncPayload;
      const removable = payload.results
        .filter((result) => result.status !== "failed")
        .map((result) => result.clientMutationId);

      await removeQueuedMutations(removable);

      for (const task of payload.changedTasks ?? []) {
        await upsertCachedTask(task);
      }

      if (payload.tasks) {
        await saveCachedTasks(payload.tasks);
      }

      setNeedsAttention(payload.results.some((result) => result.status === "failed"));
      await refreshCount();
    } catch {
      await refreshCount();
    } finally {
      setSyncing(false);
    }
  }

  useEffect(() => {
    setOnline(typeof navigator === "undefined" ? true : navigator.onLine);
    void refreshCount();

    const updateOnline = () => {
      setOnline(navigator.onLine);

      if (navigator.onLine) {
        void flushQueue();
      }
    };
    const updateQueue = () => {
      void refreshCount();

      if (typeof navigator === "undefined" || navigator.onLine) {
        void flushQueue();
      }
    };

    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    window.addEventListener("zadachnik-offline-change", updateQueue);

    const timer = window.setInterval(() => {
      if (navigator.onLine) {
        void flushQueue();
      }
    }, 15_000);

    return () => {
      window.removeEventListener("online", updateOnline);
      window.removeEventListener("offline", updateOnline);
      window.removeEventListener("zadachnik-offline-change", updateQueue);
      window.clearInterval(timer);
    };
  }, []);

  const label = !online
    ? "Офлайн"
    : needsAttention
      ? "Нужно проверить"
      : syncing
        ? "Синхронизация"
        : queued > 0
          ? `Ждет синхронизации: ${queued}`
          : "Синхронизировано";

  return (
    <div className="sync-status" data-state={!online ? "offline" : queued > 0 ? "queued" : "synced"}>
      {label}
    </div>
  );
}
