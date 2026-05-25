import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import {
  closeDb,
  resetAccessToken,
  seedOrganizationDefaults
} from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-three-mobile-token";

test.beforeEach(async ({ page }) => {
  test.skip(test.info().project.name !== "mobile", "mobile viewport coverage");
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("assistant capture is usable on mobile viewport", async ({ page }) => {
  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("button", { name: "С ассистентом" }).click();
  await page.getByLabel("Опишите задачу").fill("2026-05-27 важное рабочее письмо");
  await page.getByRole("button", { name: "Разобрать" }).click();

  await expect(page.getByText("Еще не сохранено")).toBeVisible();
  await expect(page.getByRole("button", { name: "Сохранить" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Изменить" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Отмена" })).toBeVisible();

  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByText("Задача сохранена после подтверждения.")).toBeVisible();
});
