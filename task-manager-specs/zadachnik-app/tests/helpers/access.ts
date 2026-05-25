import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
  await prisma.taskNote.deleteMany();
  await prisma.taskContext.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.context.deleteMany();
  await prisma.category.deleteMany();
}

export async function seedOrganizationDefaults() {
  const { defaultCategories, defaultContexts } = await import(
    "../../src/lib/tasks/task-options"
  );

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
