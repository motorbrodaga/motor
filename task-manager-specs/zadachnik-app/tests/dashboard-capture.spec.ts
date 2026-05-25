import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import {
  closeDb,
  resetAccessToken,
  seedOrganizationDefaults
} from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-two-capture-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("Dashboard quick capture creates a real inbox task", async ({ page }) => {
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Панель" })).toBeVisible();

  await page.getByRole("button", { name: "Быстро" }).click();
  await expect(page.getByRole("heading", { name: "Новая задача" })).toBeVisible();
  await page.getByRole("textbox", { name: "Новая задача" }).fill("Позвонить по документам");
  await page.getByRole("button", { name: "Добавить" }).click();
  await expect(page.getByText("Задача добавлена во входящие.")).toBeVisible();

  await expect
    .poll(async () => prisma.task.count({ where: { title: "Позвонить по документам" } }))
    .toBe(1);

  await page.waitForTimeout(500);
  await page.goto("/inbox");
  await expect(page.getByRole("link", { name: "Позвонить по документам" })).toBeVisible();
});
