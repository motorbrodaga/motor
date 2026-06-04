import type { TaskImportance, TaskStatus } from "@/lib/tasks/task-options";
import type { WaitingDirection } from "@/lib/tasks/task-validation";

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

export const waitingDirectionLabels: Record<WaitingDirection, string> = {
  waiting_for_me: "ждут от меня",
  waiting_for_them: "я жду"
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

export function toDateTimeInput(value?: string | Date | null) {
  if (!value) {
    return "";
  }

  const date = typeof value === "string" ? new Date(value) : value;

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function formatMinutes(value?: number | null) {
  if (value === null || value === undefined) {
    return "";
  }

  return `${value} мин`;
}
