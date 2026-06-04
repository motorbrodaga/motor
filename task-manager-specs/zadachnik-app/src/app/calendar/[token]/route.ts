import { NextResponse, type NextRequest } from "next/server";
import { buildCalendarFeed } from "@/lib/calendar/ical";
import { prisma } from "@/lib/db";

type RouteContext = {
  params: Promise<{ token: string }>;
};

export async function GET(_request: NextRequest, context: RouteContext) {
  const { token: rawToken } = await context.params;
  const token = rawToken.replace(/\.ics$/i, "");
  const feedToken = await prisma.calendarFeedToken.findUnique({ where: { token } });

  if (!feedToken?.active) {
    return new NextResponse("Calendar feed not found", { status: 404 });
  }

  const links = await prisma.taskCalendarLink.findMany({
    where: {
      task: {
        archivedAt: null
      }
    },
    include: {
      task: {
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
            take: 5
          }
        }
      }
    },
    orderBy: { startsAt: "asc" }
  });

  const body = buildCalendarFeed(
    links.map((link) => ({
      eventUid: link.eventUid,
      title: link.task.title,
      description: link.task.description,
      status: link.task.status,
      archivedAt: link.task.archivedAt,
      startsAt: link.startsAt,
      endsAt: link.endsAt,
      allDay: link.allDay,
      includeDescription: link.includeDescription,
      includeNotes: link.includeNotes,
      sequence: link.sequence,
      updatedAt: link.task.updatedAt,
      lastSyncedAt: link.lastSyncedAt,
      notes: link.task.notes
    }))
  );

  return new NextResponse(body, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}
