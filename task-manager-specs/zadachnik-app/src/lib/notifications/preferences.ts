import { prisma } from "@/lib/db";

export const notificationPreferenceKeys = ["morningReview", "taskReminders"] as const;
export type NotificationPreferenceKey = (typeof notificationPreferenceKeys)[number];

const defaults: Record<NotificationPreferenceKey, { enabled: boolean; time: string | null }> = {
  morningReview: { enabled: false, time: "09:00" },
  taskReminders: { enabled: false, time: null }
};

export async function getNotificationPreferences() {
  const rows = await prisma.notificationPreference.findMany();
  const byKey = new Map(rows.map((row) => [row.key, row]));

  return Object.fromEntries(
    notificationPreferenceKeys.map((key) => {
      const row = byKey.get(key);
      return [
        key,
        {
          enabled: row?.enabled ?? defaults[key].enabled,
          time: row?.time ?? defaults[key].time
        }
      ];
    })
  ) as Record<NotificationPreferenceKey, { enabled: boolean; time: string | null }>;
}

export async function setNotificationPreferences(input: {
  morningReview?: { enabled: boolean; time?: string | null };
  taskReminders?: { enabled: boolean };
}) {
  if (input.morningReview) {
    await prisma.notificationPreference.upsert({
      where: { key: "morningReview" },
      update: {
        enabled: input.morningReview.enabled,
        time: input.morningReview.time ?? defaults.morningReview.time
      },
      create: {
        key: "morningReview",
        enabled: input.morningReview.enabled,
        time: input.morningReview.time ?? defaults.morningReview.time
      }
    });
  }

  if (input.taskReminders) {
    await prisma.notificationPreference.upsert({
      where: { key: "taskReminders" },
      update: {
        enabled: input.taskReminders.enabled,
        time: null
      },
      create: {
        key: "taskReminders",
        enabled: input.taskReminders.enabled,
        time: null
      }
    });
  }

  return getNotificationPreferences();
}
