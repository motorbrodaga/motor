import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-seven-history-token";

function startOfLocalDay(value = new Date()) {
  return new Date(value.getFullYear(), value.getMonth(), value.getDate());
}

function addDays(value: Date, days: number) {
  const next = new Date(value);
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

test("history page shows completed tasks by day and links from more and review", async ({ page }) => {
  const today = addDays(startOfLocalDay(), 0);
  today.setHours(10, 0, 0, 0);

  const yesterday = addDays(startOfLocalDay(), -1);
  yesterday.setHours(11, 0, 0, 0);

  const week = addDays(startOfLocalDay(), -2);
  week.setHours(12, 0, 0, 0);

  await prisma.task.createMany({
    data: [
      {
        title: "Закрытая сегодня",
        status: "done",
        completedAt: today
      },
      {
        title: "Закрытая вчера",
        status: "done",
        completedAt: yesterday
      },
      {
        title: "Закрытая на неделе",
        status: "done",
        completedAt: week,
        actualMinutes: 35
      },
      {
        title: "Открытая задача",
        status: "todo"
      }
    ]
  });

  await page.goto(`/a/${token}`);
  await page.goto("/more");
  await expect(page.getByRole("link", { name: "История" })).toBeVisible();

  await page.getByRole("link", { name: "История" }).click();
  await expect(page).toHaveURL(/\/history$/);
  await expect(page.getByRole("heading", { name: "История" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "сегодня" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "вчера" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "эта неделя" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Закрытая сегодня" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Закрытая вчера" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Закрытая на неделе" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Открытая задача" })).toHaveCount(0);
  await expect(page.getByText("Факт: 35 мин")).toBeVisible();

  await page.goto("/review");
  await expect(page.getByRole("link", { name: "Посмотреть завершенное" })).toBeVisible();
});
