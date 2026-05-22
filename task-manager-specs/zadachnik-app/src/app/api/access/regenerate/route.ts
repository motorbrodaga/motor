import { NextResponse, type NextRequest } from "next/server";
import { regenerateAccessToken } from "@/lib/access-tokens";
import {
  ACCESS_SESSION_COOKIE,
  getActiveSession,
  parseAccessSessionCookie,
  setAccessSessionCookie
} from "@/lib/session";

export async function POST(request: NextRequest) {
  const tokenId = parseAccessSessionCookie(
    request.cookies.get(ACCESS_SESSION_COOKIE)?.value
  );
  const session = await getActiveSession(tokenId);

  if (!session) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }

  const nextToken = await regenerateAccessToken(session.id);
  const privateUrl = new URL(`/a/${nextToken.token}`, request.url).toString();
  const response = NextResponse.json({ privateUrl });
  setAccessSessionCookie(response, nextToken.id);
  return response;
}
