import { test, expect } from "@playwright/test";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const token = "phase-two-full-flow-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await closeDb();
});

test("private link opens the task shell on desktop and mobile", async ({ page }) => {
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Панель" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Предлагаю 3 главные задачи" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Быстро" })).toBeVisible();
});
