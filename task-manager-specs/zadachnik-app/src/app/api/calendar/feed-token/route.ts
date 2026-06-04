import { NextResponse, type NextRequest } from "next/server";
import { requireApiSession } from "@/lib/api-session";
import { getOrCreateCalendarFeedToken, regenerateCalendarFeedToken } from "@/lib/calendar/feed-token";
import { getRequestOrigin } from "@/lib/request-origin";

function feedUrl(request: NextRequest, token: string) {
  return `${getRequestOrigin(request)}/calendar/${token}.ics`;
}

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const token = await getOrCreateCalendarFeedToken();
  return NextResponse.json({ url: feedUrl(request, token.token), createdAt: token.createdAt });
}

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const token = await regenerateCalendarFeedToken();
  return NextResponse.json({ url: feedUrl(request, token.token), createdAt: token.createdAt });
}
