import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import {
  closeDb,
  resetAccessToken,
  seedOrganizationDefaults
} from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-three-flow-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("assistant capture shows interpretation before saving and can cancel", async ({ page }) => {
  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("button", { name: "С ассистентом" }).click();
  await page.getByLabel("Опишите задачу").fill("2026-05-27 важное рабочее письмо");
  await page.getByRole("button", { name: "Разобрать" }).click();

  await expect(page.getByText("Еще не сохранено")).toBeVisible();
  await expect(page.getByText("Ассистент понял так")).toBeVisible();
  await expect(page.getByText("важная")).toBeVisible();
  await expect.poll(async () => prisma.task.count()).toBe(0);

  await page.getByRole("button", { name: "Изменить" }).click();
  await page.getByLabel("Название").fill("Рабочее письмо после правки");
  await expect(page.getByLabel("Название")).toHaveValue("Рабочее письмо после правки");

  await page.getByRole("button", { name: "Отмена" }).click();
  await expect(page.getByText("Черновик отменен. Задача не создана.")).toBeVisible();
  await expect.poll(async () => prisma.task.count()).toBe(0);
});

test("assistant capture creates task only after explicit save", async ({ page }) => {
  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("button", { name: "С ассистентом" }).click();
  await page.getByLabel("Опишите задачу").fill("Разобрать заметки");
  await page.getByRole("button", { name: "Разобрать" }).click();

  await expect(page.getByText("Ассистент понял так")).toBeVisible();
  await expect.poll(async () => prisma.task.count()).toBe(0);

  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByText("Задача сохранена после подтверждения.")).toBeVisible();
  await expect.poll(async () => prisma.task.count({ where: { title: "Разобрать заметки" } })).toBe(1);
});
