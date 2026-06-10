import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const defaultCategories = [
  { name: "Работа", color: "#2f6fbb" },
  { name: "Личное", color: "#8a5fbf" },
  { name: "Звонки", color: "#c27a22" },
  { name: "Дом", color: "#3f7d46" }
] as const;
const defaultContexts = ["Звонок", "Компьютер", "Дом", "В дороге", "С человеком"] as const;

function hashToken(token: string) {
  const pepper = process.env.ACCESS_TOKEN_PEPPER ?? "development-only-pepper";
  return createHash("sha256").update(`${token}:${pepper}`).digest("hex");
}

export async function resetAccessToken(token: string) {
  await resetTaskData();
  await prisma.shellEvent.deleteMany();
  await prisma.accessToken.deleteMany();
  await prisma.accessToken.create({
    data: {
      tokenHash: hashToken(token),
      label: "Тестовая приватная ссылка"
    }
  });
}

export async function resetTaskData() {
  await prisma.appliedMutation.deleteMany();
  await prisma.backupRun.deleteMany();
  await prisma.pushSubscription.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.taskCalendarLink.deleteMany();
  await prisma.calendarFeedToken.deleteMany();
  await prisma.dailyFocusSelection.deleteMany();
  await prisma.taskNote.deleteMany();
  await prisma.taskContext.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.context.deleteMany();
  await prisma.category.deleteMany();
}

export async function seedOrganizationDefaults() {
  for (const category of defaultCategories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {
        color: category.color,
        systemDefault: true,
        archivedAt: null
      },
      create: {
        name: category.name,
        color: category.color,
        systemDefault: true
      }
    });
  }

  for (const name of defaultContexts) {
    await prisma.context.upsert({
      where: { name },
      update: {
        systemDefault: true,
        archivedAt: null
      },
      create: {
        name,
        systemDefault: true
      }
    });
  }
}

export async function closeDb() {
  await prisma.$disconnect();
}
