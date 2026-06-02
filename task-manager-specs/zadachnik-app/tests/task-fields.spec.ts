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
  const taskForm = page.locator("form.task-form");

  await page.goto(`/tasks/${task.id}`);
  await taskForm.getByLabel("День выполнения").fill("2026-05-26");
  await taskForm.getByLabel("Крайний срок").fill("2026-05-30");
  await taskForm.getByLabel("Важность").selectOption("important");
  await taskForm.getByLabel("Срочно").check();
  await taskForm.getByLabel("План, мин").fill("45");
  await taskForm.getByLabel("Факт, мин").fill("20");
  await taskForm.locator('input[name="personLabel"]').fill("Иван");
  await taskForm.locator('select[name="waitingDirection"]').selectOption("waiting_for_me");
  await taskForm.getByLabel("Ответить до").fill("2026-05-28");
  await taskForm.getByLabel("Описание").fill("Описание отдельно от заметок.");
  await page.getByRole("button", { name: "Сохранить задачу" }).click();
  await expect(page.getByText("Сохранено")).toBeVisible();

  const saved = await prisma.task.findUniqueOrThrow({ where: { id: task.id } });
  expect(saved.importance).toBe("important");
  expect(saved.isUrgent).toBe(true);
  expect(saved.estimatedMinutes).toBe(45);
  expect(saved.actualMinutes).toBe(20);
  expect(saved.dueDate?.toISOString().slice(0, 10)).toBe("2026-05-30");
  expect(saved.doDate?.toISOString().slice(0, 10)).toBe("2026-05-26");
  expect(saved.personLabel).toBe("Иван");
  expect(saved.waitingDirection).toBe("waiting_for_me");
  expect(saved.responseDueDate?.toISOString().slice(0, 10)).toBe("2026-05-28");
  expect(saved.waitingSince).toBeTruthy();
});
