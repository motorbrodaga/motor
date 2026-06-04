import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-nine-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("task detail can link a task to the calendar feed", async ({ page }) => {
  const task = await prisma.task.create({
    data: {
      title: "Важное рабочее письмо",
      description: "Написать спокойно и по делу.",
      doDate: new Date("2026-06-06T00:00:00.000Z")
    }
  });

  await page.goto(`/tasks/${task.id}`);
  await expect(page.getByText("Календарь iPhone")).toBeVisible();
  await page.getByRole("button", { name: "Добавить в календарь" }).click();
  await expect(page.getByText("Календарь обновлен.")).toBeVisible();

  const link = await prisma.taskCalendarLink.findUnique({ where: { taskId: task.id } });
  expect(link).not.toBeNull();

  const tokenPayload = (await (await page.request.get("/api/calendar/feed-token")).json()) as { url: string };
  const feed = await page.request.get(tokenPayload.url);
  expect(await feed.text()).toContain("SUMMARY:Важное рабочее письмо");
});

test("notification settings are reachable from More", async ({ page }) => {
  await page.goto("/more");
  await page.getByRole("link", { name: "Уведомления" }).click();
  await expect(page.getByRole("heading", { name: "Уведомления" })).toBeVisible();
  await expect(page.getByText("Утренний обзор", { exact: true })).toBeVisible();
  await expect(page.getByText("Напоминания задач", { exact: true })).toBeVisible();
});
