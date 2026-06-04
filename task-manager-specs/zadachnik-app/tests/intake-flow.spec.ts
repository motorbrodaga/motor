import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-eight-intake-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("manual Telegram paste prepares an editable card before save", async ({ page }) => {
  await page.goto("/more/intake");
  await page.getByRole("button", { name: "Вставка" }).click();
  await page
    .getByLabel("Текст из Telegram")
    .fill("Завтра важное рабочее письмо по договору. Нужно ответить коротко и не потерять.");
  await page.getByRole("button", { name: "Подготовить карточку" }).click();

  await expect(page.getByText("Еще не сохранено")).toBeVisible();
  await expect(page.getByText("Источник:")).toBeVisible();
  await expect.poll(async () => prisma.task.count()).toBe(0);

  await page.getByRole("button", { name: "Изменить" }).click();
  await page.getByLabel("Название").fill("Ответить на рабочее письмо");
  await page.getByRole("button", { name: "Готово" }).click();
  await page.getByRole("button", { name: "Сохранить" }).click();

  await expect(page.getByText("Задача создана после подтверждения.")).toBeVisible();

  const task = await prisma.task.findFirstOrThrow({
    where: { title: "Ответить на рабочее письмо" }
  });

  expect(task.sourceLabel).toBe("from Telegram Motorcodex_bot");
  expect(task.importance).toBe("important");
});

test("intake draft can be cancelled without creating a task", async ({ page }) => {
  await page.goto("/more/intake");
  await page.getByRole("button", { name: "Вставка" }).click();
  await page.getByLabel("Текст из Telegram").fill("Позже разобрать сообщение от бота.");
  await page.getByRole("button", { name: "Подготовить карточку" }).click();
  await page.getByRole("button", { name: "Отмена" }).click();

  await expect(page.getByText("Черновик отменен. Задача не создана.")).toBeVisible();
  await expect.poll(async () => prisma.task.count()).toBe(0);
});

test("provider APIs require explicit bounded requests", async ({ page }) => {
  const implicitTelegram = await page.request.post("/api/intake/telegram", {
    data: { limit: 20 }
  });
  expect(implicitTelegram.status()).toBe(400);

  const excessiveTelegram = await page.request.post("/api/intake/telegram", {
    data: { action: "latest", limit: 100 }
  });
  expect(excessiveTelegram.status()).toBe(400);

  const emptyGmail = await page.request.post("/api/intake/gmail", {
    data: { action: "search", query: "" }
  });
  expect(emptyGmail.status()).toBe(400);

  await expect.poll(async () => prisma.task.count()).toBe(0);
});
