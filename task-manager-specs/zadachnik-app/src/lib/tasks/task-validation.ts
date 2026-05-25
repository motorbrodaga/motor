import { isTaskImportance, isTaskStatus } from "@/lib/tasks/task-options";

export type TaskInput = {
  title?: unknown;
  description?: unknown;
  status?: unknown;
  importance?: unknown;
  isUrgent?: unknown;
  dueDate?: unknown;
  doDate?: unknown;
  estimatedMinutes?: unknown;
  actualMinutes?: unknown;
  categoryId?: unknown;
  contextIds?: unknown;
  projectId?: unknown;
  personLabel?: unknown;
};

export function cleanText(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function requireTitle(value: unknown) {
  const title = cleanText(value);

  if (!title) {
    throw new Error("Введите название задачи.");
  }

  return title;
}

export function optionalDate(value: unknown) {
  const text = cleanText(value);

  if (!text) {
    return null;
  }

  const date = new Date(`${text}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error("Некорректная дата.");
  }

  return date;
}

export function optionalMinutes(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const minutes = Number(value);

  if (!Number.isInteger(minutes) || minutes < 0 || minutes > 24 * 60) {
    throw new Error("Укажите минуты числом от 0 до 1440.");
  }

  return minutes;
}

export function optionalBoolean(value: unknown) {
  return value === true;
}

export function optionalId(value: unknown) {
  return cleanText(value);
}

export function optionalIdList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => cleanText(item))
    .filter((item): item is string => Boolean(item));
}

export function validateTaskPatch(input: TaskInput) {
  const data: Record<string, unknown> = {};

  if ("title" in input) {
    data.title = requireTitle(input.title);
  }

  if ("description" in input) {
    data.description = cleanText(input.description);
  }

  if ("status" in input) {
    if (!isTaskStatus(input.status)) {
      throw new Error("Некорректный статус.");
    }

    data.status = input.status;
    data.completedAt = input.status === "done" ? new Date() : null;
  }

  if ("importance" in input) {
    if (!isTaskImportance(input.importance)) {
      throw new Error("Некорректная важность.");
    }

    data.importance = input.importance;
  }

  if ("isUrgent" in input) {
    data.isUrgent = optionalBoolean(input.isUrgent);
  }

  if ("dueDate" in input) {
    data.dueDate = optionalDate(input.dueDate);
  }

  if ("doDate" in input) {
    data.doDate = optionalDate(input.doDate);
  }

  if ("estimatedMinutes" in input) {
    data.estimatedMinutes = optionalMinutes(input.estimatedMinutes);
  }

  if ("actualMinutes" in input) {
    data.actualMinutes = optionalMinutes(input.actualMinutes);
  }

  if ("categoryId" in input) {
    data.categoryId = optionalId(input.categoryId);
  }

  if ("projectId" in input) {
    data.projectId = optionalId(input.projectId);
  }

  if ("personLabel" in input) {
    data.personLabel = cleanText(input.personLabel);
  }

  return data;
}
