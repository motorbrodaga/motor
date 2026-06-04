import webpush from "web-push";
import { prisma } from "@/lib/db";

export type PushPayload = {
  title: string;
  body: string;
  url: string;
};

function configured() {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY &&
      process.env.VAPID_PRIVATE_KEY &&
      process.env.VAPID_SUBJECT
  );
}

export function getPushPublicConfig() {
  return {
    supported: configured(),
    publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? null
  };
}

export async function sendPushNotification(subscriptionId: string, payload: PushPayload) {
  if (!configured()) {
    return { ok: false, reason: "missing-config" as const };
  }

  const subscription = await prisma.pushSubscription.findUnique({
    where: { id: subscriptionId }
  });

  if (!subscription?.enabled) {
    return { ok: false, reason: "disabled" as const };
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: {
          p256dh: subscription.p256dh,
          auth: subscription.auth
        }
      },
      JSON.stringify(payload)
    );
    return { ok: true as const };
  } catch (error) {
    const statusCode = typeof error === "object" && error && "statusCode" in error
      ? Number((error as { statusCode?: number }).statusCode)
      : 0;

    if (statusCode === 404 || statusCode === 410) {
      await prisma.pushSubscription.update({
        where: { id: subscription.id },
        data: { enabled: false }
      });
    }

    return { ok: false, reason: "send-failed" as const };
  }
}
