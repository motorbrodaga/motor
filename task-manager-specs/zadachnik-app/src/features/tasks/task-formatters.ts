import type { TaskImportance, TaskStatus } from "@/lib/tasks/task-options";

export const statusLabels: Record<TaskStatus, string> = {
  inbox: "Входящие",
  todo: "К делу",
  in_progress: "В работе",
  waiting: "Ожидание",
  done: "Выполнено"
};

export const importanceLabels: Record<TaskImportance, string> = {
  normal: "Обычная",
  important: "Важная"
};

export function formatDate(value?: string | Date | null) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export function toDateInput(value?: string | Date | null) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function formatMinutes(value?: number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  return `${value} мин`;
}
