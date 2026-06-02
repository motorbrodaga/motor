import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-five-waiting-token";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
}

function daysFromNow(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
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

test("waiting page groups both directions and shows soft check-in", async ({ page }) => {
  await prisma.task.createMany({
    data: [
      {
        title: "Отправить ответ Анне",
        personLabel: "Анна",
        waitingDirection: "waiting_for_me",
        responseDueDate: daysFromNow(1),
        waitingSince: daysAgo(1)
      },
      {
        title: "Дождаться счета от Ивана",
        personLabel: "Иван",
        waitingDirection: "waiting_for_them",
        waitingSince: daysAgo(8)
      },
      {
        title: "Просто задача с человеком",
        personLabel: "Мария"
      },
      {
        title: "Закрытое ожидание",
        status: "done",
        personLabel: "Олег",
        waitingDirection: "waiting_for_them",
        waitingSince: daysAgo(8)
      }
    ]
  });

  await page.goto(`/a/${token}`);
  await page.goto("/waiting");

  await expect(page.getByRole("heading", { name: "ждут от меня" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "я жду" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "пора проверить" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Отправить ответ Анне" }).first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Дождаться счета от Ивана" }).first()).toBeVisible();
  await expect(page.getByText("Ответить до:").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Просто задача с человеком" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Закрытое ожидание" })).toHaveCount(0);
});
