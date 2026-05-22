import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import {
  ACCESS_SESSION_COOKIE,
  getActiveSession,
  parseAccessSessionCookie
} from "@/lib/session";

const allowedKinds = new Set([
  "quick_capture.opened",
  "quick_capture.submitted_placeholder"
]);

export async function POST(request: NextRequest) {
  const tokenId = parseAccessSessionCookie(
    request.cookies.get(ACCESS_SESSION_COOKIE)?.value
  );
  const session = await getActiveSession(tokenId);

  if (!session) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => ({}))) as {
    kind?: string;
    title?: string;
  };
  const kind = payload.kind && allowedKinds.has(payload.kind)
    ? payload.kind
    : "quick_capture.opened";

  const event = await prisma.shellEvent.create({
    data: {
      kind,
      metadataJson: JSON.stringify({ title: payload.title ?? "" })
    }
  });

  return NextResponse.json({ ok: true, id: event.id });
}
