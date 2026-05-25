import { randomBytes, createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { defaultCategories, defaultContexts } from "../src/lib/tasks/task-options";

const prisma = new PrismaClient();

function getPepper() {
  return process.env.ACCESS_TOKEN_PEPPER ?? "development-only-pepper";
}

function hashToken(token: string) {
  return createHash("sha256").update(`${token}:${getPepper()}`).digest("hex");
}

async function main() {
  const existing = await prisma.accessToken.findFirst({ where: { active: true } });
  const token = existing
    ? null
    : process.env.INITIAL_ACCESS_TOKEN ?? randomBytes(32).toString("base64url");

  if (token) {
    await prisma.accessToken.create({
      data: {
        tokenHash: hashToken(token),
        label: "Первая приватная ссылка"
      }
    });
  }

  await prisma.appSetting.upsert({
    where: { key: "app.name" },
    update: { value: "Задачник" },
    create: { key: "app.name", value: "Задачник" }
  });

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

  if (token) {
    console.log(`Private link token for local development: ${token}`);
  } else {
    console.log("Active access token already exists. Use the app to regenerate it.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
