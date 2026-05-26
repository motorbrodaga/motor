import type { TaskImportance } from "@/lib/tasks/task-options";

export type AssistantCategoryOption = {
  id: string;
  name: string;
};

export type AssistantClarificationQuestion = {
  id: "date" | "category" | "importance";
  question: string;
  options?: string[];
};

export type AssistantTaskDraft = {
  title: string;
  doDate: string | null;
  dueDate: string | null;
  categoryId: string | null;
  categoryName: string | null;
  importance: TaskImportance;
};

export type AssistantCaptureInterpretation = {
  originalPhrase: string;
  draft: AssistantTaskDraft;
  questions: AssistantClarificationQuestion[];
  missing: Array<keyof AssistantTaskDraft>;
  warnings: string[];
};

type InterpretTaskCaptureInput = {
  phrase: string;
  categories: AssistantCategoryOption[];
  now?: Date;
};

type DateMatch = {
  value: string;
  target: "doDate" | "dueDate";
  matchedText: string;
};

const russianWordTail = String.raw`[\p{L}\p{M}\d_-]*`;
const isoDatePattern = /\b(\d{4}-\d{2}-\d{2})\b/;
const importantWords = ["важно", "важная", "важное", "важный", "приоритет", "приоритетно"];
const deadlineWords = ["дедлайн", "срок", "крайний срок", "крайнему сроку"];

const categoryAliases: Record<string, string[]> = {
  работа: ["работа", "рабочее", "рабочая", "по работе"],
  личное: ["личное", "лично"],
  звонки: ["звонок", "звонки", "позвонить", "созвон"],
  дом: ["дом", "домашнее", "быт", "бытовое"]
};

function normalizeText(value: string) {
  return value
    .toLocaleLowerCase("ru-RU")
    .replace(/ё/g, "е")
    .replace(/[.,!?;:()[\]{}"']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function dateOnly(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  next.setUTCDate(next.getUTCDate() + days);
  return next;
}

function parseDate(phrase: string, now: Date): DateMatch | null {
  const normalized = normalizeText(phrase);
  const target: DateMatch["target"] = hasAnyPhrase(normalized, deadlineWords) ? "dueDate" : "doDate";
  const iso = normalized.match(isoDatePattern);

  if (iso) {
    return { value: iso[1], target, matchedText: iso[1] };
  }

  const phraseDates: Array<[string, number]> = [
    ["сегодня", 0],
    ["послезавтра", 2],
    ["завтра", 1],
    ["через неделю", 7]
  ];

  for (const [matchedText, days] of phraseDates) {
    if (hasPhrase(normalized, matchedText)) {
      return { value: dateOnly(addDays(now, days)), target, matchedText };
    }
  }

  return null;
}

function buildCategoryNeedles(category: AssistantCategoryOption) {
  const normalizedName = normalizeText(category.name);
  const aliases = categoryAliases[normalizedName] ?? [];
  return [normalizedName, ...aliases.map(normalizeText)].filter(Boolean);
}

function matchCategory(phrase: string, categories: AssistantCategoryOption[]) {
  const normalized = normalizeText(phrase);
  const matches = categories.filter((category) =>
    buildCategoryNeedles(category).some((needle) =>
      new RegExp(`(^|\\s)${escapeRegExp(needle)}($|\\s)`, "i").test(normalized)
    )
  );

  return matches.length === 1 ? matches[0] : null;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasPhrase(normalizedText: string, normalizedPhrase: string) {
  return new RegExp(`(^|\\s)${escapeRegExp(normalizedPhrase)}($|\\s)`, "i").test(normalizedText);
}

function hasAnyPhrase(normalizedText: string, phrases: string[]) {
  return phrases.some((phrase) => hasPhrase(normalizedText, normalizeText(phrase)));
}

function stripKnownSignals(phrase: string, dateMatch: DateMatch | null, category: AssistantCategoryOption | null) {
  let title = phrase;

  if (dateMatch) {
    title = title.replace(new RegExp(escapeRegExp(dateMatch.matchedText), "i"), " ");
  }

  if (category) {
    for (const needle of buildCategoryNeedles(category).sort((a, b) => b.length - a.length)) {
      title = title.replace(new RegExp(`(^|\\s)${escapeRegExp(needle)}($|\\s)`, "i"), " ");
    }
  }

  title = title
    .replace(new RegExp(`важн${russianWordTail}`, "giu"), " ")
    .replace(new RegExp(`приоритет${russianWordTail}`, "giu"), " ")
    .replace(new RegExp(`крайн${russianWordTail}\\s+срок${russianWordTail}`, "giu"), " ")
    .replace(new RegExp(`дедлайн${russianWordTail}`, "giu"), " ")
    .replace(new RegExp(`срок${russianWordTail}`, "giu"), " ")
    .replace(/задача|надо|нужно|сделать/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return title || phrase.trim();
}

export function interpretTaskCapture({
  phrase,
  categories,
  now = new Date()
}: InterpretTaskCaptureInput): AssistantCaptureInterpretation {
  const cleanPhrase = phrase.trim();
  const dateMatch = parseDate(cleanPhrase, now);
  const category = matchCategory(cleanPhrase, categories);
  const importance: TaskImportance = hasAnyPhrase(normalizeText(cleanPhrase), importantWords)
    ? "important"
    : "normal";
  const title = stripKnownSignals(cleanPhrase, dateMatch, category);

  const draft: AssistantTaskDraft = {
    title,
    doDate: dateMatch?.target === "doDate" ? dateMatch.value : null,
    dueDate: dateMatch?.target === "dueDate" ? dateMatch.value : null,
    categoryId: category?.id ?? null,
    categoryName: category?.name ?? null,
    importance
  };

  const missing: Array<keyof AssistantTaskDraft> = [];

  if (!draft.doDate && !draft.dueDate) {
    missing.push("doDate");
  }

  if (!draft.categoryId) {
    missing.push("categoryId");
  }

  if (draft.importance === "normal") {
    missing.push("importance");
  }

  const questions: AssistantClarificationQuestion[] = [];

  if (!draft.doDate && !draft.dueDate) {
    questions.push({
      id: "date",
      question: "На какой день поставить задачу?",
      options: ["Сегодня", "Завтра", "Без даты"]
    });
  }

  if (!draft.categoryId) {
    questions.push({
      id: "category",
      question: "К какой категории отнести задачу?",
      options: [...categories.slice(0, 4).map((item) => item.name), "Без категории"]
    });
  }

  if (questions.length < 2 && draft.importance === "normal") {
    questions.push({
      id: "importance",
      question: "Отметить как важную?",
      options: ["Да", "Нет"]
    });
  }

  return {
    originalPhrase: cleanPhrase,
    draft,
    questions: questions.slice(0, 2),
    missing,
    warnings: cleanPhrase ? [] : ["Введите, что нужно не забыть."]
  };
}
