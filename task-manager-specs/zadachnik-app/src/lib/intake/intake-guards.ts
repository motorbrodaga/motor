import { cleanText } from "@/lib/tasks/task-validation";

const maxLimit = 20;

export function requireExplicitAction(value: unknown, expected: string) {
  if (value !== expected) {
    throw new Error("Нужно явное действие импорта.");
  }
}

export function normalizeIntakeLimit(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return maxLimit;
  }

  const limit = Number(value);

  if (!Number.isInteger(limit) || limit < 1 || limit > maxLimit) {
    throw new Error("Можно показать не больше 20 вариантов.");
  }

  return limit;
}

export function requireSearchQuery(value: unknown) {
  const query = cleanText(value);

  if (!query) {
    throw new Error("Введите поисковый запрос.");
  }

  if (query.length > 120) {
    throw new Error("Сделайте запрос короче.");
  }

  return query;
}

export function sanitizeSourceText(value: unknown) {
  const text = cleanText(value);

  if (!text) {
    throw new Error("Выберите сообщение или вставьте текст.");
  }

  return text.replace(/\s+/g, " ").slice(0, 4000);
}

export function sanitizePreview(value: string, length = 180) {
  const compact = value.replace(/\s+/g, " ").trim();
  return compact.length > length ? `${compact.slice(0, length - 1)}…` : compact;
}
