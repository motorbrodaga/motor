import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/db";

export async function getOrCreateCalendarFeedToken() {
  const existing = await prisma.calendarFeedToken.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" }
  });

  if (existing) {
    return existing;
  }

  return prisma.calendarFeedToken.create({
    data: {
      token: randomBytes(24).toString("base64url"),
      label: "Основная подписка"
    }
  });
}

export async function regenerateCalendarFeedToken() {
  await prisma.calendarFeedToken.updateMany({
    where: { active: true },
    data: { active: false }
  });

  return prisma.calendarFeedToken.create({
    data: {
      token: randomBytes(24).toString("base64url"),
      label: "Основная подписка"
    }
  });
}
