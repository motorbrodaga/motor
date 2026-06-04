import { expect, test } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { sendDueNotifications } from "@/lib/notifications/scheduler";
import { closeDb, resetAccessToken } from "./helpers/access";

const prisma = new PrismaClient();

test.beforeEach(async () => {
  await resetAccessToken("notification-test-token");
  await prisma.notificationPreference.deleteMany();
  await prisma.pushSubscription.deleteMany();
});

test.afterAll(async () => {
  await prisma.$disconnect();
  await closeDb();
});

test("sends morning review once per day", async () => {
  await prisma.notificationPreference.create({
    data: { key: "morningReview", enabled: true, time: "09:00" }
  });

  const first = await sendDueNotifications(new Date(2026, 5, 5, 9, 0, 0));
  const second = await sendDueNotifications(new Date(2026, 5, 5, 9, 0, 0));

  expect(first.sent).toEqual(["morningReview"]);
  expect(second.sent).toEqual([]);
});

test("marks due task reminder as sent", async () => {
  await prisma.notificationPreference.create({
    data: { key: "taskReminders", enabled: true, time: null }
  });
  const task = await prisma.task.create({
    data: {
      title: "Позвонить",
      reminderAt: new Date("2026-06-05T08:30:00.000Z")
    }
  });

  const result = await sendDueNotifications(new Date("2026-06-05T09:00:00.000Z"));
  const updated = await prisma.task.findUniqueOrThrow({ where: { id: task.id } });

  expect(result.sent).toEqual([`task:${task.id}`]);
  expect(updated.reminderSentAt).not.toBeNull();
});
