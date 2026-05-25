import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import {
  closeDb,
  resetAccessToken,
  seedOrganizationDefaults
} from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-three-save-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("confirmed assistant task saves date category and importance", async ({ page }) => {
  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("button", { name: "С ассистентом" }).click();
  await page.getByLabel("Опишите задачу").fill("2026-05-27 важное рабочее письмо");
  await page.getByRole("button", { name: "Разобрать" }).click();

  await expect(page.getByText("Ассистент понял так")).toBeVisible();
  await expect.poll(async () => prisma.task.count()).toBe(0);

  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByText("Задача сохранена после подтверждения.")).toBeVisible();

  const task = await prisma.task.findFirstOrThrow({
    where: { title: { contains: "письмо" } },
    include: { category: true }
  });

  expect(task.doDate?.toISOString().slice(0, 10)).toBe("2026-05-27");
  expect(task.importance).toBe("important");
  expect(task.category?.name).toBe("Работа");
});

test("confirmed incomplete assistant task is allowed", async ({ page }) => {
  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("button", { name: "С ассистентом" }).click();
  await page.getByLabel("Опишите задачу").fill("Разобрать заметки");
  await page.getByRole("button", { name: "Разобрать" }).click();
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByText("Задача сохранена после подтверждения.")).toBeVisible();

  const task = await prisma.task.findFirstOrThrow({
    where: { title: "Разобрать заметки" }
  });

  expect(task.doDate).toBeNull();
  expect(task.dueDate).toBeNull();
  expect(task.categoryId).toBeNull();
  expect(task.importance).toBe("normal");
});

test("assistant cancel leaves database unchanged", async ({ page }) => {
  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("button", { name: "С ассистентом" }).click();
  await page.getByLabel("Опишите задачу").fill("2026-05-27 важное рабочее письмо");
  await page.getByRole("button", { name: "Разобрать" }).click();
  await expect(page.getByText("Ассистент понял так")).toBeVisible();

  await page.getByRole("button", { name: "Отмена" }).click();

  await expect.poll(async () => prisma.task.count()).toBe(0);
});
