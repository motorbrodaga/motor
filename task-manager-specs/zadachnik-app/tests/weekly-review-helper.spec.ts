import { expect, test } from "@playwright/test";
import type { TaskView } from "@/features/tasks/task-types";
import {
  buildReviewSections,
  startOfReviewWeek
} from "@/lib/review/weekly-review";

function localDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function task(overrides: Partial<TaskView>): TaskView {
  return {
    id: overrides.id ?? "task",
    title: overrides.title ?? "Задача",
    description: null,
    status: "todo",
    importance: "normal",
    isUrgent: false,
    dueDate: null,
    doDate: null,
    estimatedMinutes: null,
    actualMinutes: null,
    personLabel: null,
    waitingDirection: null,
    responseDueDate: null,
    waitingSince: null,
    completedAt: null,
    archivedAt: null,
    category: null,
    project: null,
    contexts: [],
    ...overrides
  };
}

test("weekly review starts on Monday", () => {
  expect(localDateKey(startOfReviewWeek(new Date("2026-06-03T12:00:00.000Z")))).toBe("2026-06-01");
  expect(localDateKey(startOfReviewWeek(new Date("2026-06-07T12:00:00.000Z")))).toBe("2026-06-01");
});

test("review sections cover no dates stale forgotten and waiting", () => {
  const now = new Date("2026-06-15T12:00:00.000Z");
  const sections = buildReviewSections(
    [
      task({
        id: "no-due",
        title: "Нет срока",
        doDate: "2026-06-16T00:00:00.000Z",
        updatedAt: "2026-06-14T00:00:00.000Z"
      }),
      task({
        id: "no-do",
        title: "Нет дня",
        dueDate: "2026-06-20T00:00:00.000Z",
        updatedAt: "2026-06-14T00:00:00.000Z"
      }),
      task({
        id: "stale",
        title: "Без движения",
        dueDate: "2026-06-30T00:00:00.000Z",
        doDate: "2026-06-20T00:00:00.000Z",
        updatedAt: "2026-06-01T00:00:00.000Z"
      }),
      task({
        id: "waiting",
        title: "Жду ответ",
        personLabel: "Иван",
        waitingDirection: "waiting_for_them",
        waitingSince: "2026-06-01T00:00:00.000Z",
        updatedAt: "2026-05-30T00:00:00.000Z"
      })
    ],
    now
  );

  expect(sections.find((section) => section.id === "no-due-date")?.tasks.map(({ id }) => id)).toContain("no-due");
  expect(sections.find((section) => section.id === "no-do-date")?.tasks.map(({ id }) => id)).toContain("no-do");
  expect(sections.find((section) => section.id === "stale")?.tasks.map(({ id }) => id)).toContain("stale");
  expect(sections.find((section) => section.id === "forgotten")?.tasks.map(({ id }) => id)).toContain("waiting");
  expect(sections.find((section) => section.id === "waiting")?.tasks.map(({ id }) => id)).toContain("waiting");
});
