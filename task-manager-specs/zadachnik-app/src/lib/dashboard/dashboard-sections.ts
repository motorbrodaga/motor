import type { Prisma } from "@prisma/client";
import type { TaskView } from "@/features/tasks/task-types";
import { prisma } from "@/lib/db";
import { taskInclude } from "@/lib/tasks/task-queries";

export type DashboardCategorySection = {
  id: string;
  name: string;
  color: string;
  openCount: number;
  recentTasks: TaskView[];
};

export type DashboardSections = {
  openTasks: TaskView[];
  today: TaskView[];
  overdue: TaskView[];
  waiting: TaskView[];
  importantWithoutDueDate: TaskView[];
  categories: DashboardCategorySection[];
};

const openTaskWhere: Prisma.TaskWhereInput = {
  archivedAt: null,
  status: { not: "done" }
};

function startOfLocalDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function serializeTask(task: unknown) {
  return JSON.parse(JSON.stringify(task)) as TaskView;
}

export async function getDashboardSections(now = new Date()): Promise<DashboardSections> {
  const todayStart = startOfLocalDay(now);
  const tomorrowStart = addDays(todayStart, 1);

  const [openTasks, today, overdue, waiting, importantWithoutDueDate, categories] = await Promise.all([
    prisma.task.findMany({
      where: openTaskWhere,
      include: taskInclude,
      orderBy: [{ updatedAt: "desc" }]
    }),
    prisma.task.findMany({
      where: {
        ...openTaskWhere,
        doDate: {
          gte: todayStart,
          lt: tomorrowStart
        }
      },
      include: taskInclude,
      orderBy: [{ isUrgent: "desc" }, { importance: "asc" }, { updatedAt: "desc" }]
    }),
    prisma.task.findMany({
      where: {
        ...openTaskWhere,
        dueDate: {
          lt: todayStart
        }
      },
      include: taskInclude,
      orderBy: [{ dueDate: "asc" }, { updatedAt: "desc" }]
    }),
    prisma.task.findMany({
      where: {
        ...openTaskWhere,
        OR: [{ status: "waiting" }, { personLabel: { not: null } }]
      },
      include: taskInclude,
      orderBy: [{ updatedAt: "desc" }]
    }),
    prisma.task.findMany({
      where: {
        ...openTaskWhere,
        importance: "important",
        dueDate: null
      },
      include: taskInclude,
      orderBy: [{ updatedAt: "desc" }]
    }),
    prisma.category.findMany({
      where: { archivedAt: null },
      orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
    })
  ]);

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
    openTasks: openTasks.map(serializeTask),
    today: today.map(serializeTask),
    overdue: overdue.map(serializeTask),
    waiting: waiting.map(serializeTask),
    importantWithoutDueDate: importantWithoutDueDate.map(serializeTask),
    categories: categorySections.filter((category) => category.openCount > 0)
  };
}
