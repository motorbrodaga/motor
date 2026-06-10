"use client";

import type { TaskView } from "@/features/tasks/task-types";

export type OfflineOperation =
  | "task.create"
  | "task.patch"
  | "task.archive"
  | "task.note.create";

export type QueuedMutation = {
  clientMutationId: string;
  operation: OfflineOperation;
  taskId?: string;
  localTaskId?: string;
  payload?: Record<string, unknown>;
  clientUpdatedAt: string;
};

const DB_NAME = "zadachnik-offline";
const DB_VERSION = 1;
const TASK_STORE = "tasks";
const MUTATION_STORE = "mutations";
const META_STORE = "meta";

let dbPromise: Promise<IDBDatabase> | null = null;

function canUseIndexedDb() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb() {
  if (!canUseIndexedDb()) {
    return Promise.reject(new Error("IndexedDB недоступен."));
  }

  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains(TASK_STORE)) {
        db.createObjectStore(TASK_STORE, { keyPath: "id" });
      }

      if (!db.objectStoreNames.contains(MUTATION_STORE)) {
        const store = db.createObjectStore(MUTATION_STORE, { keyPath: "clientMutationId" });
        store.createIndex("clientUpdatedAt", "clientUpdatedAt");
      }

      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: "key" });
      }
    };

    request.onerror = () => reject(request.error ?? new Error("Не удалось открыть офлайн-хранилище."));
    request.onsuccess = () => resolve(request.result);
  });

  return dbPromise;
}

function txStore<T>(
  storeName: string,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest<T> | void
) {
  return openDb().then(
    (db) =>
      new Promise<T>((resolve, reject) => {
        const tx = db.transaction(storeName, mode);
        const store = tx.objectStore(storeName);
        const request = action(store);
        let result: T;

        if (request) {
          request.onsuccess = () => {
            result = request.result;
          };
          request.onerror = () => reject(request.error ?? new Error("Ошибка офлайн-хранилища."));
        }

        tx.oncomplete = () => resolve(result);
        tx.onerror = () => reject(tx.error ?? new Error("Ошибка офлайн-хранилища."));
      })
  );
}

function emitChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("zadachnik-offline-change"));
  }
}

export async function saveCachedTasks(tasks: TaskView[]) {
  if (!canUseIndexedDb()) {
    return;
  }

  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction([TASK_STORE, META_STORE], "readwrite");
    const taskStore = tx.objectStore(TASK_STORE);

    for (const task of tasks) {
      taskStore.put(task);
    }

    tx.objectStore(META_STORE).put({
      key: "lastTaskCacheAt",
      value: new Date().toISOString()
    });

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Не удалось сохранить задачи офлайн."));
  });

  emitChange();
}

export async function getCachedTasks() {
  if (!canUseIndexedDb()) {
    return [];
  }

  return txStore<TaskView[]>(TASK_STORE, "readonly", (store) => store.getAll()).catch(() => []);
}

export async function upsertCachedTask(task: TaskView) {
  if (!canUseIndexedDb()) {
    return;
  }

  await txStore(TASK_STORE, "readwrite", (store) => store.put(task));
  emitChange();
}

export async function patchCachedTask(taskId: string, payload: Record<string, unknown>) {
  if (!canUseIndexedDb()) {
    return;
  }

  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(TASK_STORE, "readwrite");
    const store = tx.objectStore(TASK_STORE);
    const request = store.get(taskId);

    request.onsuccess = () => {
      const task = request.result as TaskView | undefined;

      if (task) {
        store.put({
          ...task,
          ...payload,
          updatedAt: new Date().toISOString()
        });
      }
    };

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Не удалось обновить локальную задачу."));
  });

  emitChange();
}

export async function archiveCachedTask(taskId: string) {
  if (!canUseIndexedDb()) {
    return;
  }

  await txStore(TASK_STORE, "readwrite", (store) => store.delete(taskId));
  emitChange();
}

export async function addQueuedMutation(mutation: QueuedMutation) {
  if (!canUseIndexedDb()) {
    throw new Error("Офлайн-хранилище недоступно.");
  }

  await txStore(MUTATION_STORE, "readwrite", (store) => store.put(mutation));
  emitChange();
}

export async function getQueuedMutations() {
  if (!canUseIndexedDb()) {
    return [];
  }

  const mutations = await txStore<QueuedMutation[]>(MUTATION_STORE, "readonly", (store) =>
    store.getAll()
  ).catch(() => []);

  return mutations.sort((a, b) => a.clientUpdatedAt.localeCompare(b.clientUpdatedAt));
}

export async function removeQueuedMutations(ids: string[]) {
  if (!canUseIndexedDb() || ids.length === 0) {
    return;
  }

  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(MUTATION_STORE, "readwrite");
    const store = tx.objectStore(MUTATION_STORE);

    for (const id of ids) {
      store.delete(id);
    }

    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Не удалось очистить очередь."));
  });

  emitChange();
}

export async function countQueuedMutations() {
  if (!canUseIndexedDb()) {
    return 0;
  }

  return txStore<number>(MUTATION_STORE, "readonly", (store) => store.count()).catch(() => 0);
}

export function buildLocalTask(payload: Record<string, unknown>, localTaskId: string): TaskView {
  const now = new Date().toISOString();

  return {
    id: localTaskId,
    title: typeof payload.title === "string" ? payload.title : "Новая задача",
    description: typeof payload.description === "string" ? payload.description : null,
    status: typeof payload.status === "string" ? payload.status : "inbox",
    importance: typeof payload.importance === "string" ? payload.importance : "normal",
    isUrgent: payload.isUrgent === true,
    dueDate: typeof payload.dueDate === "string" && payload.dueDate ? payload.dueDate : null,
    doDate: typeof payload.doDate === "string" && payload.doDate ? payload.doDate : null,
    estimatedMinutes: typeof payload.estimatedMinutes === "number" ? payload.estimatedMinutes : null,
    actualMinutes: typeof payload.actualMinutes === "number" ? payload.actualMinutes : null,
    sourceLabel: typeof payload.sourceLabel === "string" ? payload.sourceLabel : null,
    personLabel: typeof payload.personLabel === "string" ? payload.personLabel : null,
    waitingDirection: typeof payload.waitingDirection === "string" ? payload.waitingDirection : null,
    responseDueDate:
      typeof payload.responseDueDate === "string" && payload.responseDueDate
        ? payload.responseDueDate
        : null,
    waitingSince: null,
    reminderAt: typeof payload.reminderAt === "string" ? payload.reminderAt : null,
    reminderSentAt: null,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
    archivedAt: null,
    category: null,
    project: null,
    contexts: [],
    notes: []
  };
}
