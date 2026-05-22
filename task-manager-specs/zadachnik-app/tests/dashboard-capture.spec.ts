import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-one-capture-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("Dashboard opens first and quick capture records a shell event", async ({ page }) => {
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Панель" })).toBeVisible();

  await page.getByRole("button", { name: "Быстро" }).click();
  await expect(page.getByRole("heading", { name: "Новая задача" })).toBeVisible();
  await page.getByLabel("Коротко").fill("Позвонить по документам");
  await page.getByRole("button", { name: "Проверить ввод" }).click();
  await expect(page.getByText("Сохранение задач появится в следующей фазе.")).toBeVisible();

  await expect
    .poll(async () => prisma.shellEvent.count({
      where: { kind: "quick_capture.submitted_placeholder" }
    }))
    .toBeGreaterThan(0);
});
