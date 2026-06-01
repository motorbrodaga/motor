import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-four-focus-ranking-token";

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

test("urgency outranks importance and other-for-today follows suggestions", async ({ page }) => {
  const today = startOfLocalDay();
  const yesterday = addDays(today, -1);

  await prisma.task.createMany({
    data: [
      {
        title: "Срочно без важности",
        status: "todo",
        isUrgent: true,
        doDate: today
      },
      {
        title: "Важное без срочности",
        status: "todo",
        importance: "important",
        doDate: today
      },
      {
        title: "Ждет ответа от Олега",
        status: "waiting",
        personLabel: "Олег",
        doDate: today
      },
      {
        title: "Четвертая задача на сегодня",
        status: "todo",
        doDate: today
      },
      {
        title: "Обычная просрочка",
        status: "todo",
        dueDate: yesterday
      }
    ]
  });

  await page.goto(`/a/${token}`);

  await expect(page.getByRole("heading", { name: "Предлагаю 3 главные задачи" })).toBeVisible();
  await expect(page.getByText("Это только предложения. Выбор подтвердим отдельно.")).toBeVisible();
  await expect(page.getByText("Предложение").first()).toBeVisible();

  const focus = page.getByTestId("daily-focus-suggestions");
  const titles = await focus.locator(".task-card__title").allTextContents();
  expect(titles).toHaveLength(3);
  expect(titles[0]).toBe("Срочно без важности");
  expect(titles).toContain("Важное без срочности");
  expect(titles).toContain("Ждет ответа от Олега");
  expect(titles).not.toContain("Обычная просрочка");

  await expect(focus.getByText("Почему:").first()).toBeVisible();
  await expect(focus.getByText("срочно").first()).toBeVisible();
  await expect(focus.getByText("важное").first()).toBeVisible();
  await expect(focus.getByText("ждут ответа").first()).toBeVisible();

  const other = page.getByTestId("other-for-today");
  await expect(other).toBeVisible();
  await expect(other.getByRole("heading", { name: "Остальное на сегодня" })).toBeVisible();
  await expect(other.getByRole("link", { name: "Четвертая задача на сегодня" })).toBeVisible();
  await expect(other.getByRole("link", { name: "Срочно без важности" })).toHaveCount(0);
  await expect(other.getByRole("link", { name: "Важное без срочности" })).toHaveCount(0);
  await expect(other.getByRole("link", { name: "Ждет ответа от Олега" })).toHaveCount(0);
});

test("estimated size does not exclude a task from suggestions", async ({ page }) => {
  const today = startOfLocalDay();

  await prisma.task.create({
    data: {
      title: "Большая задача на сегодня",
      status: "todo",
      doDate: today,
      estimatedMinutes: 360
    }
  });

  await page.goto(`/a/${token}`);

  const focus = page.getByTestId("daily-focus-suggestions");
  await expect(focus.getByRole("link", { name: "Большая задача на сегодня" })).toBeVisible();
  await expect(focus.getByText("на сегодня", { exact: true })).toBeVisible();
  await expect(page.getByTestId("other-for-today")).toBeVisible();
});
