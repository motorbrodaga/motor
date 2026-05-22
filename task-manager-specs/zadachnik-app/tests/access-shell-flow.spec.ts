import { test, expect } from "@playwright/test";
import { closeDb, resetAccessToken } from "./helpers/access";

const token = "phase-one-full-flow-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await closeDb();
});

test("private link opens the Phase 1 shell on desktop and mobile", async ({ page }) => {
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Панель" })).toBeVisible();
  await expect(page.getByText("Главное на сегодня")).toBeVisible();
  await expect(page.getByRole("button", { name: "Быстро" })).toBeVisible();
});
