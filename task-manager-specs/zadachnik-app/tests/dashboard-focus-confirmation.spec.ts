import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-four-focus-confirmation-token";

function startOfLocalDay(date = new Date()) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

test.beforeEach(async () => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("daily focus API rejects unauthenticated calls", async ({ request }) => {
  const response = await request.post("/api/daily-focus", {
    data: { slot: 0, taskId: "missing" }
  });

  expect(response.status()).toBe(401);
});

test("focus suggestions are confirmed separately and persist after reload", async ({ page }) => {
  const today = startOfLocalDay();

  await prisma.task.createMany({
    data: [
      {
        title: "Первый срочный фокус",
        status: "todo",
        isUrgent: true,
        doDate: today
      },
      {
        title: "Второй важный фокус",
        status: "todo",
        importance: "important",
        doDate: today
      },
      {
        title: "Третий ждет ответа",
        status: "waiting",
        personLabel: "Анна",
        doDate: today
      },
      {
        title: "Ручная замена на сегодня",
        status: "todo",
        doDate: today
      }
    ]
  });

  await page.goto(`/a/${token}`);

  const slot0 = page.getByTestId("focus-slot-0");
  const slot1 = page.getByTestId("focus-slot-1");
  const slot2 = page.getByTestId("focus-slot-2");

  await expect(slot0.locator(".daily-focus__suggestion-meta").getByText("Предложение")).toBeVisible();
  await expect(slot1.locator(".daily-focus__suggestion-meta").getByText("Предложение")).toBeVisible();
  expect(await prisma.dailyFocusSelection.count()).toBe(0);

  await slot0.getByRole("button", { name: "Подтвердить" }).click();
  await expect(slot0.locator(".daily-focus__suggestion-meta").getByText("Подтверждено")).toBeVisible();
  await expect(slot1.locator(".daily-focus__suggestion-meta").getByText("Предложение")).toBeVisible();
  await expect(slot2.locator(".daily-focus__suggestion-meta").getByText("Предложение")).toBeVisible();

  let selections = await prisma.dailyFocusSelection.findMany({ orderBy: { slot: "asc" } });
  expect(selections).toHaveLength(1);
  expect(selections[0].slot).toBe(0);

  await page.reload();
  await expect(page.getByTestId("focus-slot-0").locator(".daily-focus__suggestion-meta").getByText("Подтверждено")).toBeVisible();
  await expect(page.getByTestId("focus-slot-1").locator(".daily-focus__suggestion-meta").getByText("Предложение")).toBeVisible();

  await page.getByTestId("focus-slot-1").getByRole("button", { name: "Заменить" }).click();
  await page.getByRole("button", { name: "Ручная замена на сегодня" }).click();

  await expect(page.getByTestId("focus-slot-1").locator(".daily-focus__suggestion-meta").getByText("Подтверждено")).toBeVisible();
  await expect(page.getByTestId("focus-slot-1").getByRole("link", { name: "Ручная замена на сегодня" })).toBeVisible();
  await expect(page.getByTestId("focus-slot-0").getByRole("link", { name: "Первый срочный фокус" })).toBeVisible();
  await expect(page.getByTestId("other-for-today").getByRole("link", { name: "Ручная замена на сегодня" })).toHaveCount(0);

  selections = await prisma.dailyFocusSelection.findMany({ orderBy: { slot: "asc" } });
  expect(selections).toHaveLength(2);
  expect(selections.map((selection) => selection.slot)).toEqual([0, 1]);
  expect(new Set(selections.map((selection) => selection.taskId)).size).toBe(2);

  await page.reload();
  await expect(page.getByTestId("focus-slot-1").getByRole("link", { name: "Ручная замена на сегодня" })).toBeVisible();
});
