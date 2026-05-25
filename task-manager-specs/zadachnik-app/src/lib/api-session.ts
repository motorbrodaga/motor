import { NextResponse, type NextRequest } from "next/server";
import {
  ACCESS_SESSION_COOKIE,
  getActiveSession,
  parseAccessSessionCookie
} from "@/lib/session";

export async function requireApiSession(request: NextRequest) {
  const tokenId = parseAccessSessionCookie(
    request.cookies.get(ACCESS_SESSION_COOKIE)?.value
  );
  const session = await getActiveSession(tokenId);

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Нет доступа" }, { status: 401 })
    };
  }

  return { session, response: null };
}

export function apiError(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Не удалось сохранить.";
  return NextResponse.json({ error: message }, { status });
}
