import { expect, test } from "@playwright/test";
import type { TaskView } from "@/features/tasks/task-types";
import { needsWaitingCheckIn } from "@/lib/waiting/waiting-tasks";

const baseTask: TaskView = {
  id: "task",
  title: "Проверить ожидание",
  description: null,
  status: "todo",
  importance: "normal",
  isUrgent: false,
  dueDate: null,
  doDate: null,
  estimatedMinutes: null,
  actualMinutes: null,
  personLabel: "Иван",
  waitingDirection: "waiting_for_them",
  responseDueDate: null,
  waitingSince: "2026-05-01T00:00:00.000Z",
  completedAt: null,
  archivedAt: null,
  category: null,
  project: null,
  contexts: []
};

test("я жду без даты мягко возвращается через неделю", () => {
  expect(needsWaitingCheckIn(baseTask, new Date("2026-05-08T10:00:00.000Z"))).toBe(true);
});

test("новое ожидание или ожидание с датой не просит проверки", () => {
  expect(
    needsWaitingCheckIn(
      {
        ...baseTask,
        waitingSince: "2026-05-04T00:00:00.000Z"
      },
      new Date("2026-05-08T10:00:00.000Z")
    )
  ).toBe(false);

  expect(
    needsWaitingCheckIn(
      {
        ...baseTask,
        dueDate: "2026-05-10T00:00:00.000Z"
      },
      new Date("2026-05-08T10:00:00.000Z")
    )
  ).toBe(false);
});
