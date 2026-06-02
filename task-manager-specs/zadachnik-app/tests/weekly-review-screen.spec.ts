import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-six-review-token";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

test.beforeEach(async () => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("weekly review shows soft groups categories and quick actions", async ({ page }) => {
  const work = await prisma.category.findFirstOrThrow({ where: { archivedAt: null } });

  await prisma.task.createMany({
    data: [
      {
        title: "Вернуть старую задачу",
        updatedAt: daysAgo(16),
        createdAt: daysAgo(20),
        categoryId: work.id
      },
      {
        title: "Проверить зависшую задачу",
        dueDate: daysAgo(-5),
        doDate: daysAgo(-3),
        updatedAt: daysAgo(8),
        categoryId: work.id
      },
      {
        title: "Дождаться ответа от Ивана",
        personLabel: "Иван",
        waitingDirection: "waiting_for_them",
        waitingSince: daysAgo(9),
        updatedAt: daysAgo(2)
      },
      {
        title: "Закрытая задача",
        status: "done",
        updatedAt: daysAgo(20)
      }
    ]
  });

  await page.goto(`/a/${token}`);
  await page.goto("/review");

  await expect(page.getByRole("heading", { name: "Обзор", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Мягкий недельный обзор" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "можно вернуть" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "стоит проверить" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "без срока" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "без дня" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "ожидания без движения" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "накопилось по категориям" })).toBeVisible();

  await expect(page.getByRole("link", { name: "Вернуть старую задачу" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Проверить зависшую задачу" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Дождаться ответа от Ивана" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Закрытая задача" })).toHaveCount(0);

  await expect(page.getByRole("button", { name: "Оставить" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Завтра" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Через неделю" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Важно" }).first()).toBeVisible();
  await expect(page.getByRole("button", { name: "Готово" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Открыть" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: work.name })).toBeVisible();
});
