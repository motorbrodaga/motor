import { expect, test } from "@playwright/test";
import type { TaskView } from "@/features/tasks/task-types";
import {
  buildHistorySections,
  startOfHistoryWeek
} from "@/lib/history/completion-history";

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
    status: "done",
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

test("completion history week starts on Monday", () => {
  expect(localDateKey(startOfHistoryWeek(new Date("2026-06-03T12:00:00.000Z")))).toBe("2026-06-01");
  expect(localDateKey(startOfHistoryWeek(new Date("2026-06-07T12:00:00.000Z")))).toBe("2026-06-01");
});

test("completion history groups today yesterday and this week", () => {
  const sections = buildHistorySections(
    [
      task({ id: "today", completedAt: "2026-06-04T09:00:00.000Z" }),
      task({ id: "yesterday", completedAt: "2026-06-03T09:00:00.000Z" }),
      task({ id: "week", completedAt: "2026-06-01T09:00:00.000Z" }),
      task({ id: "old", completedAt: "2026-05-28T09:00:00.000Z" })
    ],
    new Date("2026-06-04T12:00:00.000Z")
  );

  expect(sections.find((section) => section.id === "today")?.tasks.map(({ id }) => id)).toEqual(["today"]);
  expect(sections.find((section) => section.id === "yesterday")?.tasks.map(({ id }) => id)).toEqual(["yesterday"]);
  expect(sections.find((section) => section.id === "this-week")?.tasks.map(({ id }) => id)).toEqual(["week"]);
});

