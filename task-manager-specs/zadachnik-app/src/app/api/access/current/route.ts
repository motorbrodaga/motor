import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_SESSION_COOKIE, getActiveSession, parseAccessSessionCookie } from "@/lib/session";

export async function GET(request: NextRequest) {
  const tokenId = parseAccessSessionCookie(
    request.cookies.get(ACCESS_SESSION_COOKIE)?.value
  );
  const session = await getActiveSession(tokenId);

  return NextResponse.json({
    authenticated: Boolean(session)
  });
}
