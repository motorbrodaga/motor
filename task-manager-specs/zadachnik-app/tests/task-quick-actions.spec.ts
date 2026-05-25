import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { closeDb, resetAccessToken, seedOrganizationDefaults } from "./helpers/access";

const prisma = new PrismaClient();
const token = "phase-two-actions-token";

test.beforeEach(async ({ page }) => {
  await resetAccessToken(token);
  await seedOrganizationDefaults();
  await page.goto(`/a/${token}`);
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("task card quick actions reschedule, change importance, add note, and assign person", async ({ page }) => {
  const task = await prisma.task.create({ data: { title: "Позвонить подрядчику" } });

  await page.goto("/inbox");
  await page.getByRole("button", { name: "Завтра" }).click();
  await page.getByRole("button", { name: "Важность" }).click();
  await page.getByLabel("Заметка").fill("Договориться о времени.");
  await page.getByRole("button", { name: "Добавить заметку" }).click();
  await page.getByLabel("Человек").fill("Иван");
  await page.getByRole("button", { name: "Назначить" }).click();

  await expect
    .poll(async () => {
      const saved = await prisma.task.findUniqueOrThrow({ where: { id: task.id } });
      const notes = await prisma.taskNote.count({ where: { taskId: task.id } });
      return {
        hasDate: Boolean(saved.doDate),
        importance: saved.importance,
        personLabel: saved.personLabel,
        notes
      };
    })
    .toEqual({
      hasDate: true,
      importance: "important",
      personLabel: "Иван",
      notes: 1
    });

  await page.waitForTimeout(500);
  await page.goto(`/tasks/${task.id}`);
  await expect(page.getByText("Договориться о времени.")).toBeVisible();
});
