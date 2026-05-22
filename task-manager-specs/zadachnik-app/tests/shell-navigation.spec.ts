import { test, expect } from "@playwright/test";
import { closeDb, resetAccessToken } from "./helpers/access";

const token = "phase-one-navigation-token";
const navLabels = ["Панель", "Входящие", "Ожидания", "Обзор", "Еще"];

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await closeDb();
});

test("mobile shell shows Russian bottom navigation", async ({ page, isMobile }) => {
  test.skip(!isMobile, "mobile viewport only");

  for (const label of navLabels) {
    await expect(page.getByRole("link", { name: label })).toBeVisible();
  }

  await page.getByRole("link", { name: "Ожидания" }).click();
  await expect(page).toHaveURL(/\/waiting$/);
  await expect(page.getByRole("heading", { name: "Ожидания" })).toBeVisible();
});

test("desktop shell navigates all sections and More keeps MVP scope", async ({ page, isMobile }) => {
  test.skip(isMobile, "desktop viewport only");

  for (const label of navLabels) {
    await expect(page.getByRole("link", { name: label })).toBeVisible();
  }

  await page.getByRole("link", { name: "Входящие" }).click();
  await expect(page).toHaveURL(/\/inbox$/);
  await page.getByRole("link", { name: "Еще" }).click();
  await expect(page).toHaveURL(/\/more$/);
  await expect(page.getByText("Все задачи")).toHaveCount(0);
  await expect(page.getByText("Категории")).toHaveCount(0);
});
