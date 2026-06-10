import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "offline-flow-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("quick task can be queued offline and synced after reconnect", async ({ page, context }) => {
  await context.setOffline(true);

  await page.getByRole("button", { name: "Быстро" }).click();
  await page.getByRole("textbox", { name: "Новая задача" }).fill("Офлайн задача с телефона");
  await page.getByRole("button", { name: "Добавить" }).click();

  await expect(page.getByText("Задача сохранена на телефоне. Ждет синхронизации.")).toBeVisible();
  await expect
    .poll(async () => prisma.task.count({ where: { title: "Офлайн задача с телефона" } }))
    .toBe(0);

  await context.setOffline(false);
  await expect
    .poll(async () => prisma.task.count({ where: { title: "Офлайн задача с телефона" } }), {
      timeout: 15_000
    })
    .toBe(1);
});
