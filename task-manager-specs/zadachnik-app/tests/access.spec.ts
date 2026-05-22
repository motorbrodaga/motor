import { test, expect } from "@playwright/test";
import { closeDb, resetAccessToken } from "./helpers/access";

const token = "phase-one-private-token";

test.beforeEach(async () => {
  await resetAccessToken(token);
});

test.afterAll(async () => {
  await closeDb();
});

test("valid private link opens Dashboard and regeneration invalidates the old token", async ({
  page
}) => {
  await page.goto(`/a/${token}`);
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Панель" })).toBeVisible();

  await page.goto("/more/access");
  await page.getByRole("button", { name: "Перегенерировать ссылку" }).click();

  const input = page.getByLabel("Новая ссылка");
  await expect(input).toBeVisible();
  const nextUrl = await input.inputValue();
  expect(nextUrl).toContain("/a/");

  await page.context().clearCookies();
  await page.goto(`/a/${token}`);
  await expect(page).toHaveURL(/access=invalid/);

  await page.goto(nextUrl);
  await expect(page).toHaveURL(/\/dashboard$/);
});
