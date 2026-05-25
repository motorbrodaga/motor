export const taskStatuses = ["inbox", "todo", "in_progress", "waiting", "done"] as const;
export type TaskStatus = (typeof taskStatuses)[number];

export const taskImportanceValues = ["normal", "important"] as const;
export type TaskImportance = (typeof taskImportanceValues)[number];

export const defaultCategories = [
  { name: "Работа", color: "#2f6fbb" },
  { name: "Личное", color: "#8a5fbf" },
  { name: "Звонки", color: "#c27a22" },
  { name: "Дом", color: "#3f7d46" }
] as const;

export const defaultContexts = [
  "Звонок",
  "Компьютер",
  "Дом",
  "В дороге",
  "С человеком"
] as const;

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === "string" && taskStatuses.includes(value as TaskStatus);
}

export function isTaskImportance(value: unknown): value is TaskImportance {
  return (
    typeof value === "string" &&
    taskImportanceValues.includes(value as TaskImportance)
  );
}
