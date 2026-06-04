import type { Prisma } from "@prisma/client";
import type { TaskView } from "@/features/tasks/task-types";
import { prisma } from "@/lib/db";
import { taskInclude } from "@/lib/tasks/task-queries";

export type HistorySectionId = "today" | "yesterday" | "this-week";

export type HistorySection = {
  id: HistorySectionId;
  title: string;
  description: string;
  empty: string;
  tasks: TaskView[];
};

export type CompletionHistory = {
  generatedAt: Date;
  weekStart: Date;
  sections: HistorySection[];
  stats: CompletionStats;
};

type HistoryTaskRecord = Prisma.TaskGetPayload<{ include: typeof taskInclude }>;

export type CompletionCategoryStat = {
  id: string;
  name: string;
  color: string;
  count: number;
  actualMinutes: number;
};

export type CompletionStats = {
  completedCount: number;
  totalActualMinutes: number;
  categories: CompletionCategoryStat[];
};

function startOfLocalDay(value: Date) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
  next.setDate(next.getDate() + days);
  return next;
}

export function startOfHistoryWeek(value: Date) {
  const day = startOfLocalDay(value);
  const weekday = day.getDay();
  const offset = weekday === 0 ? -6 : 1 - weekday;
  return addDays(day, offset);
}

function toIso(value?: Date | null) {
  return value ? value.toISOString() : null;
}

function toTaskView(task: HistoryTaskRecord): TaskView {
  return {
    ...task,
    dueDate: toIso(task.dueDate),
    doDate: toIso(task.doDate),
    responseDueDate: toIso(task.responseDueDate),
    waitingSince: toIso(task.waitingSince),
    reminderAt: toIso(task.reminderAt),
    reminderSentAt: toIso(task.reminderSentAt),
    completedAt: toIso(task.completedAt),
    archivedAt: toIso(task.archivedAt),
    createdAt: toIso(task.createdAt) ?? undefined,
    updatedAt: toIso(task.updatedAt) ?? undefined
  };
}

export function buildHistorySections(tasks: TaskView[], now = new Date()): HistorySection[] {
  const todayStart = startOfLocalDay(now);
  const tomorrowStart = addDays(todayStart, 1);
  const yesterdayStart = addDays(todayStart, -1);
  const weekStart = startOfHistoryWeek(now);

  const inRange = (task: TaskView, start: Date, end: Date) => {
    if (!task.completedAt) {
      return false;
    }

    const completedAt = new Date(task.completedAt);
    return completedAt >= start && completedAt < end;
  };

  return [
    {
      id: "today",
      title: "сегодня",
      description: "То, что уже можно спокойно отпустить из головы.",
      empty: "Сегодня пока ничего не закрыто.",
      tasks: tasks.filter((task) => inRange(task, todayStart, tomorrowStart))
    },
    {
      id: "yesterday",
      title: "вчера",
      description: "Недавние завершения, если нужно вспомнить ход дня.",
      empty: "За вчера закрытых задач нет.",
      tasks: tasks.filter((task) => inRange(task, yesterdayStart, todayStart))
    },
    {
      id: "this-week",
      title: "эта неделя",
      description: "Остальное завершенное с начала недели.",
      empty: "С начала недели больше закрытых задач нет.",
      tasks: tasks.filter((task) => inRange(task, weekStart, yesterdayStart))
    }
  ];
}

export function buildCompletionStats(tasks: TaskView[]): CompletionStats {
  const categories = new Map<string, CompletionCategoryStat>();
  let totalActualMinutes = 0;

  for (const task of tasks) {
    const actualMinutes = task.actualMinutes ?? 0;
    totalActualMinutes += actualMinutes;

    const category = task.category ?? {
      id: "uncategorized",
      name: "без категории",
      color: "#8a8f98"
    };
    const current = categories.get(category.id) ?? {
      id: category.id,
      name: category.name,
      color: category.color,
      count: 0,
      actualMinutes: 0
    };

    current.count += 1;
    current.actualMinutes += actualMinutes;
    categories.set(category.id, current);
  }

  return {
    completedCount: tasks.length,
    totalActualMinutes,
    categories: Array.from(categories.values()).sort((left, right) => right.count - left.count)
  };
}

export async function getCompletionHistory(now = new Date()): Promise<CompletionHistory> {
  const weekStart = startOfHistoryWeek(now);
  const tasks = await prisma.task.findMany({
    where: {
      archivedAt: null,
      completedAt: {
        gte: weekStart
      }
    },
    include: taskInclude,
    orderBy: {
      completedAt: "desc"
    }
  });
  const taskViews = tasks.map(toTaskView);

  return {
    generatedAt: now,
    weekStart,
    sections: buildHistorySections(taskViews, now),
    stats: buildCompletionStats(taskViews)
  };
}
