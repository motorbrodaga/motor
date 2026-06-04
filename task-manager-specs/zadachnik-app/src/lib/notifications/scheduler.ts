import { prisma } from "@/lib/db";
import { getNotificationPreferences } from "@/lib/notifications/preferences";
import { sendPushNotification } from "@/lib/notifications/web-push";

function timeKey(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function startOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(date: Date) {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

async function sendToAll(title: string, body: string, url: string) {
  const subscriptions = await prisma.pushSubscription.findMany({
    where: { enabled: true }
  });
  const results = [];

  for (const subscription of subscriptions) {
    results.push(await sendPushNotification(subscription.id, { title, body, url }));
  }

  return results;
}

export async function sendDueNotifications(now = new Date()) {
  const preferences = await getNotificationPreferences();
  const sent: string[] = [];

  if (preferences.morningReview.enabled && preferences.morningReview.time === timeKey(now)) {
    const today = startOfDay(now);
    const key = `morningReview:${today.toISOString().slice(0, 10)}`;
    const alreadySent = await prisma.shellEvent.findFirst({ where: { kind: key } });

    if (!alreadySent) {
      await sendToAll("Задачник", "Пора открыть задачи", "/dashboard");
      await prisma.shellEvent.create({ data: { kind: key } });
      sent.push("morningReview");
    }
  }

  if (preferences.taskReminders.enabled) {
    const dueTasks = await prisma.task.findMany({
      where: {
        archivedAt: null,
        status: { not: "done" },
        reminderAt: {
          lte: now
        },
        reminderSentAt: null
      },
      orderBy: { reminderAt: "asc" },
      take: 20
    });

    for (const task of dueTasks) {
      await sendToAll("Задачник", `Пора открыть: ${task.title}`, `/tasks/${task.id}`);
      await prisma.task.update({
        where: { id: task.id },
        data: { reminderSentAt: now }
      });
      sent.push(`task:${task.id}`);
    }
  }

  await prisma.task.updateMany({
    where: {
      reminderAt: {
        gt: endOfDay(now)
      },
      reminderSentAt: {
        not: null
      }
    },
    data: { reminderSentAt: null }
  });

  return { sent };
}
