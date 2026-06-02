import type { Prisma } from "@prisma/client";
import type { TaskView } from "@/features/tasks/task-types";
import { prisma } from "@/lib/db";
import { taskInclude } from "@/lib/tasks/task-queries";

export const WAITING_FOR_ME = "waiting_for_me";
export const WAITING_FOR_THEM = "waiting_for_them";
export const WAITING_FOLLOW_UP_DAYS = 7;

export type WaitingDirectionValue = typeof WAITING_FOR_ME | typeof WAITING_FOR_THEM;

export type WaitingSections = {
  forMe: TaskView[];
  forThem: TaskView[];
  checkIn: TaskView[];
};

const openTaskWhere: Prisma.TaskWhereInput = {
  archivedAt: null,
  status: { not: "done" }
};

function serializeTask(task: unknown) {
  return JSON.parse(JSON.stringify(task)) as TaskView;
}

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDate(value: string | null) {
  return value ? new Date(value) : null;
}

export function isWaitingTask(task: Pick<TaskView, "personLabel" | "waitingDirection">) {
  return Boolean(task.personLabel && task.waitingDirection);
}

export function needsWaitingCheckIn(task: TaskView, now = new Date()) {
  if (task.waitingDirection !== WAITING_FOR_THEM) {
    return false;
  }

  if (task.dueDate || task.responseDueDate || !task.waitingSince) {
    return false;
  }

  const waitingSince = toDate(task.waitingSince);

  if (!waitingSince) {
    return false;
  }

  const threshold = addDays(startOfLocalDay(waitingSince), WAITING_FOLLOW_UP_DAYS);
  return startOfLocalDay(now) >= threshold;
}

export async function getWaitingSections(now = new Date()): Promise<WaitingSections> {
  const tasks = await prisma.task.findMany({
    where: {
      ...openTaskWhere,
      personLabel: { not: null },
      waitingDirection: {
        in: [WAITING_FOR_ME, WAITING_FOR_THEM]
      }
    },
    include: taskInclude,
    orderBy: [{ responseDueDate: "asc" }, { updatedAt: "desc" }]
  });

  const serialized = tasks.map(serializeTask).filter(isWaitingTask);

  return {
    forMe: serialized.filter((task) => task.waitingDirection === WAITING_FOR_ME),
    forThem: serialized.filter((task) => task.waitingDirection === WAITING_FOR_THEM),
    checkIn: serialized.filter((task) => needsWaitingCheckIn(task, now))
  };
}
