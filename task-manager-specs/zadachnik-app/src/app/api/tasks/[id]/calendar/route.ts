import { NextResponse, type NextRequest } from "next/server";
import { apiError, requireApiSession } from "@/lib/api-session";
import { getOrCreateCalendarFeedToken } from "@/lib/calendar/feed-token";
import { createCalendarLinkData, validateCalendarLinkInput } from "@/lib/calendar/task-calendar";
import { prisma } from "@/lib/db";
import { getRequestOrigin } from "@/lib/request-origin";
import { taskDetailInclude } from "@/lib/tasks/task-queries";

type RouteContext = {
  params: Promise<{ id: string }>;
};

function feedUrl(request: NextRequest, token: string) {
  return `${getRequestOrigin(request)}/calendar/${token}.ics`;
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => ({}))) as Record<string, unknown>;
    const existing = await prisma.taskCalendarLink.findUnique({ where: { taskId: id } });
    const now = new Date();

    if (existing) {
      await prisma.taskCalendarLink.update({
        where: { taskId: id },
        data: {
          ...validateCalendarLinkInput(payload),
          sequence: { increment: 1 },
          lastSyncedAt: now
        }
      });
    } else {
      await prisma.taskCalendarLink.create({
        data: createCalendarLinkData(id, payload)
      });
    }

    const [task, token] = await Promise.all([
      prisma.task.findUniqueOrThrow({
        where: { id },
        include: taskDetailInclude
      }),
      getOrCreateCalendarFeedToken()
    ]);

    return NextResponse.json({
      task,
      calendarLink: task.calendarLink,
      feedUrl: feedUrl(request, token.token)
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const { id } = await context.params;
  await prisma.taskCalendarLink.deleteMany({ where: { taskId: id } });
  return NextResponse.json({ ok: true });
}
