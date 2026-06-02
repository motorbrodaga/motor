import type { Prisma } from "@prisma/client";
import type { TaskView } from "@/features/tasks/task-types";
import { prisma } from "@/lib/db";
import { taskInclude } from "@/lib/tasks/task-queries";
import { WAITING_FOR_THEM } from "@/lib/waiting/waiting-tasks";

export const STALE_DAYS = 7;
export const FORGOTTEN_DAYS = 14;

export type ReviewSection = {
  id: string;
  title: string;
  description: string;
  empty: string;
  tasks: TaskView[];
};

export type ReviewCategorySection = {
  id: string;
  name: string;
  color: string;
  openCount: number;
  recentTasks: TaskView[];
};

export type WeeklyReview = {
  weekStart: string;
  isMonday: boolean;
  sections: ReviewSection[];
  categories: ReviewCategorySection[];
};

const openTaskWhere: Prisma.TaskWhereInput = {
  archivedAt: null,
  status: { not: "done" }
};

function serializeTask(task: unknown) {
  return JSON.parse(JSON.stringify(task)) as TaskView;
}

export function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfReviewWeek(date: Date) {
  const day = startOfLocalDay(date);
  const dayOfWeek = day.getDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  return addDays(day, offset);
}

function toDate(value?: string | null) {
  return value ? new Date(value) : null;
}

function isBeforeOrEqual(value: Date | null, threshold: Date) {
  return Boolean(value && value <= threshold);
}

function olderThanDays(value: string | null | undefined, now: Date, days: number) {
  return isBeforeOrEqual(toDate(value), addDays(startOfLocalDay(now), -days));
}

function isWaitingWithoutMovement(task: TaskView, now: Date) {
  if (task.waitingDirection !== WAITING_FOR_THEM) {
    return false;
  }

  return olderThanDays(task.waitingSince, now, STALE_DAYS);
}

function uniqueById(tasks: TaskView[]) {
  const seen = new Set<string>();
  return tasks.filter((task) => {
    if (seen.has(task.id)) {
      return false;
    }

    seen.add(task.id);
    return true;
  });
}

export function buildReviewSections(tasks: TaskView[], now = new Date()): ReviewSection[] {
  const staleTasks = tasks.filter((task) => olderThanDays(task.updatedAt, now, STALE_DAYS));
  const forgottenTasks = tasks.filter((task) => {
    const noDates = !task.dueDate && !task.doDate;
    return noDates && olderThanDays(task.updatedAt ?? task.createdAt, now, FORGOTTEN_DAYS);
  });

  return [
    {
      id: "forgotten",
      title: "можно вернуть",
      description: "Давно открытые задачи без движения. Без спешки, просто чтобы не потерялись.",
      empty: "Давно забытых задач нет.",
      tasks: uniqueById(forgottenTasks)
    },
    {
      id: "stale",
      title: "стоит проверить",
      description: "Задачи без изменений за последнюю неделю.",
      empty: "Зависших задач за неделю нет.",
      tasks: uniqueById(staleTasks)
    },
    {
      id: "no-due-date",
      title: "без срока",
      description: "Открытые задачи без крайнего срока. Можно оставить так или назначить дату.",
      empty: "Задач без срока нет.",
      tasks: uniqueById(tasks.filter((task) => !task.dueDate))
    },
    {
      id: "no-do-date",
      title: "без дня",
      description: "Задачи без дня выполнения. Их легко забыть, если они не всплывают в обзоре.",
      empty: "Задач без дня выполнения нет.",
      tasks: uniqueById(tasks.filter((task) => !task.doDate))
    },
    {
      id: "waiting",
      title: "ожидания без движения",
      description: "Ожидания, которые стоит мягко проверить.",
      empty: "Ожиданий без движения нет.",
      tasks: uniqueById(tasks.filter((task) => isWaitingWithoutMovement(task, now)))
    }
  ];
}

export async function getWeeklyReview(now = new Date()): Promise<WeeklyReview> {
  const weekStart = startOfReviewWeek(now);
  const [tasks, categories] = await Promise.all([
    prisma.task.findMany({
      where: openTaskWhere,
      include: taskInclude,
      orderBy: [{ updatedAt: "asc" }, { createdAt: "asc" }]
    }),
    prisma.category.findMany({
      where: { archivedAt: null },
      orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
    })
  ]);
  const serializedTasks = tasks.map(serializeTask);

  const categorySections = await Promise.all(
    categories.map(async (category) => {
      const where: Prisma.TaskWhereInput = {
        ...openTaskWhere,
        categoryId: category.id
      };
      const [openCount, recentTasks] = await Promise.all([
        prisma.task.count({ where }),
        prisma.task.findMany({
          where,
          include: taskInclude,
          orderBy: [{ updatedAt: "desc" }],
          take: 3
        })
      ]);

      return {
        id: category.id,
        name: category.name,
        color: category.color,
        openCount,
        recentTasks: recentTasks.map(serializeTask)
      };
    })
  );

  return {
    weekStart: weekStart.toISOString(),
    isMonday: startOfLocalDay(now).getDay() === 1,
    sections: buildReviewSections(serializedTasks, now),
    categories: categorySections.filter((category) => category.openCount > 0)
  };
}
