import type { TaskView } from "@/features/tasks/task-types";
import { prisma } from "@/lib/db";
import { taskInclude } from "@/lib/tasks/task-queries";

export type ConfirmedFocusSelection = {
  id: string;
  focusDate: string;
  slot: number;
  taskId: string;
  confirmedAt: string;
  task: TaskView;
};

export function getFocusDate(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function serializeSelection(selection: unknown) {
  return JSON.parse(JSON.stringify(selection)) as ConfirmedFocusSelection;
}

function assertSlot(slot: unknown) {
  if (!Number.isInteger(slot) || Number(slot) < 0 || Number(slot) > 2) {
    throw new Error("Некорректный слот фокуса.");
  }

  return Number(slot);
}

export async function getConfirmedFocusSelections(now = new Date()) {
  const focusDate = getFocusDate(now);
  const selections = await prisma.dailyFocusSelection.findMany({
    where: {
      focusDate,
      task: {
        archivedAt: null,
        status: { not: "done" }
      }
    },
    include: {
      task: {
        include: taskInclude
      }
    },
    orderBy: { slot: "asc" }
  });

  return selections.map(serializeSelection);
}

export async function confirmDailyFocusSlot(slotInput: unknown, taskId: unknown, now = new Date()) {
  const slot = assertSlot(slotInput);

  if (typeof taskId !== "string" || taskId.length === 0) {
    throw new Error("Выберите задачу для фокуса.");
  }

  const focusDate = getFocusDate(now);
  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      archivedAt: null,
      status: { not: "done" }
    }
  });

  if (!task) {
    throw new Error("Задача недоступна для фокуса.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.dailyFocusSelection.deleteMany({
      where: {
        focusDate,
        taskId,
        slot: { not: slot }
      }
    });

    await tx.dailyFocusSelection.upsert({
      where: {
        focusDate_slot: {
          focusDate,
          slot
        }
      },
      update: {
        taskId,
        confirmedAt: new Date()
      },
      create: {
        focusDate,
        slot,
        taskId
      }
    });
  });

  return getConfirmedFocusSelections(now);
}
