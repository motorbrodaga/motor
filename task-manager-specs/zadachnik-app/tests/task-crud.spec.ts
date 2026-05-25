import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-two-crud-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("user can create, edit, complete, and archive a task", async ({ page }) => {
  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("textbox", { name: "Новая задача" }).fill("Разобрать входящие бумаги");
  await page.getByRole("button", { name: "Добавить" }).click();
  await expect
    .poll(async () => prisma.task.count({ where: { title: "Разобрать входящие бумаги" } }))
    .toBe(1);

  await page.waitForTimeout(500);
  await page.goto("/inbox");
  await page.getByRole("link", { name: "Разобрать входящие бумаги" }).click();
  await page.getByLabel("Название").fill("Разобрать документы");
  await page.getByLabel("Статус").selectOption("todo");
  await page.getByLabel("Описание").fill("Проверить папку и записать следующие шаги.");
  await page.getByRole("button", { name: "Сохранить задачу" }).click();
  await expect(page.getByText("Сохранено")).toBeVisible();

  await page.waitForTimeout(500);
  await page.goto("/inbox");
  await expect(page.getByRole("link", { name: "Разобрать документы" })).toBeVisible();
  await page.getByRole("button", { name: "Выполнить" }).first().click();
  await expect(page.getByRole("link", { name: "Разобрать документы" })).toBeHidden();

  const doneTask = await prisma.task.findFirstOrThrow({
    where: { title: "Разобрать документы" }
  });
  expect(doneTask.status).toBe("done");
  expect(doneTask.completedAt).not.toBeNull();

  const archive = await prisma.task.create({
    data: { title: "Скрыть эту задачу", status: "inbox" }
  });
  await page.waitForTimeout(500);
  await page.goto("/inbox");
  await expect(page.getByRole("link", { name: archive.title })).toBeVisible();
  await page.getByLabel("Скрыть задачу").first().click();
  await expect(page.getByRole("link", { name: archive.title })).toBeHidden();
});
