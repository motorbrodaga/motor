import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-four-mobile-token";

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

test("Daily focus dashboard is usable on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "mobile-specific coverage");

  const today = startOfLocalDay();
  const yesterday = addDays(today, -1);
  const work = await prisma.category.findUniqueOrThrow({ where: { name: "Работа" } });

  await prisma.task.createMany({
    data: [
      {
        title: "Мобильный срочный фокус",
        status: "todo",
        isUrgent: true,
        doDate: today,
        categoryId: work.id
      },
      {
        title: "Мобильный важный фокус",
        status: "todo",
        importance: "important",
        doDate: today,
        categoryId: work.id
      },
      {
        title: "Мобильное ожидание",
        status: "waiting",
        personLabel: "Ира",
        doDate: today
      },
      {
        title: "Мобильное остальное",
        status: "todo",
        doDate: today
      },
      {
        title: "Мобильная просрочка",
        status: "todo",
        dueDate: yesterday,
        importance: "important"
      }
    ]
  });

  await page.goto(`/a/${token}`);
  await expect(page.getByRole("button", { name: "Быстро" })).toBeVisible();

  await expect(page.getByRole("heading", { name: "Предлагаю 3 главные задачи" })).toBeVisible();
  await expect(page.getByTestId("focus-slot-0").getByRole("button", { name: "Подтвердить" })).toBeVisible();
  await expect(page.getByTestId("focus-slot-0").getByRole("button", { name: "Заменить" })).toBeVisible();

  await page.getByTestId("focus-slot-0").getByRole("button", { name: "Заменить" }).click();
  await expect(page.getByRole("button", { name: "Мобильное остальное" })).toBeVisible();

  await page.getByTestId("other-for-today").scrollIntoViewIfNeeded();
  await expect(page.getByTestId("other-for-today").getByRole("heading", { name: "Остальное на сегодня" })).toBeVisible();

  await page.getByRole("heading", { name: "Просрочено" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Просрочено" })).toBeVisible();
  await page.getByRole("heading", { name: "Категории" }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: "Категории" })).toBeVisible();
});
