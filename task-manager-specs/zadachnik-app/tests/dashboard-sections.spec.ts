import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-four-dashboard-sections-token";

function startOfLocalDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

test.beforeEach(async () => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("dashboard sections show open work and hide completed or archived tasks", async ({ page }) => {
  const today = startOfLocalDay();
  const yesterday = addDays(today, -1);
  const work = await prisma.category.findUniqueOrThrow({ where: { name: "Работа" } });
  const home = await prisma.category.findUniqueOrThrow({ where: { name: "Дом" } });

  await prisma.task.createMany({
    data: [
      {
        title: "Сегодня подготовить письмо",
        status: "todo",
        doDate: today,
        categoryId: work.id
      },
      {
        title: "Просроченный отчет",
        status: "todo",
        dueDate: yesterday,
        categoryId: work.id
      },
      {
        title: "Жду ответ от Ивана",
        status: "waiting",
        personLabel: "Иван",
        waitingDirection: "waiting_for_them",
        categoryId: home.id
      },
      {
        title: "Просто задача с человеком",
        status: "todo",
        personLabel: "Мария",
        categoryId: home.id
      },
      {
        title: "Важная идея без срока",
        status: "todo",
        importance: "important"
      },
      {
        title: "Завершенная сегодня",
        status: "done",
        doDate: today,
        categoryId: work.id
      },
      {
        title: "Скрытая просрочка",
        status: "todo",
        dueDate: yesterday,
        archivedAt: new Date(),
        categoryId: home.id
      }
    ]
  });

  await page.goto(`/a/${token}`);
  await expect(page).toHaveURL(/\/dashboard$/);

  await expect(page.getByRole("heading", { name: "Сегодня", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Просрочено" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Ожидания" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Важное без срока" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Категории" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Сегодня подготовить письмо" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Просроченный отчет" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Жду ответ от Ивана" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Важная идея без срока" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "Работа" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Дом" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Завершенная сегодня" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Скрытая просрочка" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Ожидания" }).locator("..").getByRole("link", { name: "Просто задача с человеком" })).toHaveCount(0);
});

test("dashboard sections show calm empty states", async ({ page }) => {
  await page.goto(`/a/${token}`);

  await expect(page.getByText("На сегодня задач нет. Можно спокойно выбрать главное вручную.")).toBeVisible();
  await expect(page.getByText("Просроченных задач нет.")).toBeVisible();
  await expect(page.getByText("Ожиданий пока нет.")).toBeVisible();
  await expect(page.getByText("Важных задач без срока нет.")).toBeVisible();
  await expect(page.getByText("Открытых задач по категориям пока нет.")).toBeVisible();
});
