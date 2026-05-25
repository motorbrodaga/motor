import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-two-organization-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("user can manage categories, contexts, projects, and assign them to a task", async ({ page }) => {
  await page.goto("/more/categories");
  await expect(page.getByText("Работа")).toBeVisible();
  await page.getByLabel("Название").fill("Финансы");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect
    .poll(async () => prisma.category.count({ where: { name: "Финансы" } }))
    .toBe(1);
  await page.reload();
  await expect(page.getByText("Финансы")).toBeVisible();

  await page.goto("/more/contexts");
  await expect(page.getByText("Компьютер")).toBeVisible();
  await page.getByLabel("Название").fill("Банк");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect
    .poll(async () => prisma.context.count({ where: { name: "Банк" } }))
    .toBe(1);
  await page.reload();
  await expect(page.getByText("Банк")).toBeVisible();

  await page.goto("/more/projects");
  await page.getByLabel("Название").fill("Личный порядок");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect
    .poll(async () => prisma.project.count({ where: { name: "Личный порядок" } }))
    .toBe(1);
  await page.reload();
  await expect(page.getByText("Личный порядок")).toBeVisible();

  const task = await prisma.task.create({ data: { title: "Разложить платежи" } });
  await page.goto(`/tasks/${task.id}`);
  await page.getByLabel("Категория").selectOption({ label: "Финансы" });
  await page.getByLabel("Проект").selectOption({ label: "Личный порядок" });
  await page.getByLabel("Банк").check();
  await page.getByRole("button", { name: "Сохранить задачу" }).click();
  await expect(page.getByText("Сохранено")).toBeVisible();

  await page.waitForTimeout(500);
  await page.goto("/inbox");
  await expect(page.getByText("Финансы")).toBeVisible();
  await expect(page.getByText("Банк")).toBeVisible();
  await expect(page.getByText("Личный порядок")).toBeVisible();
});
