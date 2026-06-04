import { NextResponse, type NextRequest } from "next/server";
import { apiError, requireApiSession } from "@/lib/api-session";
import { getNotificationPreferences, setNotificationPreferences } from "@/lib/notifications/preferences";
import { getPushPublicConfig } from "@/lib/notifications/web-push";

function bool(value: unknown) {
  return value === true;
}

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const [preferences, subscriptionCount] = await Promise.all([
    getNotificationPreferences(),
    import("@/lib/db").then(({ prisma }) =>
      prisma.pushSubscription.count({ where: { enabled: true } })
    )
  ]);

  return NextResponse.json({
    preferences,
    push: {
      ...getPushPublicConfig(),
      subscriptionCount
    }
  });
}

export async function PATCH(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      morningReview?: { enabled?: unknown; time?: unknown };
      taskReminders?: { enabled?: unknown };
    };
    const time = typeof payload.morningReview?.time === "string" ? payload.morningReview.time : null;

    const preferences = await setNotificationPreferences({
      morningReview: payload.morningReview
        ? { enabled: bool(payload.morningReview.enabled), time }
        : undefined,
      taskReminders: payload.taskReminders
        ? { enabled: bool(payload.taskReminders.enabled) }
        : undefined
    });

    return NextResponse.json({ preferences });
  } catch (error) {
    return apiError(error);
  }
}
