import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-two-fields-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("user can edit scheduling, importance, urgency, time, and description", async ({ page }) => {
  const task = await prisma.task.create({ data: { title: "Настроить поля" } });

  await page.goto(`/tasks/${task.id}`);
  await page.getByLabel("День выполнения").fill("2026-05-26");
  await page.getByLabel("Крайний срок").fill("2026-05-30");
  await page.getByLabel("Важность").selectOption("important");
  await page.getByLabel("Срочно").check();
  await page.getByLabel("План, мин").fill("45");
  await page.getByLabel("Факт, мин").fill("20");
  await page.getByLabel("Описание").fill("Описание отдельно от заметок.");
  await page.getByRole("button", { name: "Сохранить задачу" }).click();
  await expect(page.getByText("Сохранено")).toBeVisible();

  const saved = await prisma.task.findUniqueOrThrow({ where: { id: task.id } });
  expect(saved.importance).toBe("important");
  expect(saved.isUrgent).toBe(true);
  expect(saved.estimatedMinutes).toBe(45);
  expect(saved.actualMinutes).toBe(20);
  expect(saved.dueDate?.toISOString().slice(0, 10)).toBe("2026-05-30");
  expect(saved.doDate?.toISOString().slice(0, 10)).toBe("2026-05-26");
});
