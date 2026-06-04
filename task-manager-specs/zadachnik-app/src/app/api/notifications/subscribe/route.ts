import { NextResponse, type NextRequest } from "next/server";
import { apiError, requireApiSession } from "@/lib/api-session";
import { prisma } from "@/lib/db";

type PushSubscriptionInput = {
  endpoint?: unknown;
  keys?: {
    p256dh?: unknown;
    auth?: unknown;
  };
  label?: unknown;
};

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as PushSubscriptionInput;

    if (
      typeof payload.endpoint !== "string" ||
      typeof payload.keys?.p256dh !== "string" ||
      typeof payload.keys?.auth !== "string"
    ) {
      throw new Error("Не удалось сохранить подписку на уведомления.");
    }

    const subscription = await prisma.pushSubscription.upsert({
      where: { endpoint: payload.endpoint },
      update: {
        p256dh: payload.keys.p256dh,
        auth: payload.keys.auth,
        label: typeof payload.label === "string" ? payload.label : null,
        enabled: true,
        lastSeenAt: new Date()
      },
      create: {
        endpoint: payload.endpoint,
        p256dh: payload.keys.p256dh,
        auth: payload.keys.auth,
        label: typeof payload.label === "string" ? payload.label : null
      }
    });

    return NextResponse.json({ subscriptionId: subscription.id });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const payload = (await request.json().catch(() => ({}))) as { endpoint?: unknown };

  if (typeof payload.endpoint === "string") {
    await prisma.pushSubscription.updateMany({
      where: { endpoint: payload.endpoint },
      data: { enabled: false }
    });
  }

  return NextResponse.json({ ok: true });
}
