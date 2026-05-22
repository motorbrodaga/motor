import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_SESSION_COOKIE } from "@/lib/session-cookie";

const protectedPrefixes = ["/dashboard", "/inbox", "/waiting", "/review", "/more"];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const needsAccess = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!needsAccess) {
    return NextResponse.next();
  }

  const sid = request.nextUrl.searchParams.get("sid");

  if (sid) {
    const url = request.nextUrl.clone();
    url.searchParams.delete("sid");
    const response = NextResponse.redirect(url);
    response.cookies.set({
      name: ACCESS_SESSION_COOKIE,
      value: sid,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365
    });
    return response;
  }

  const session = request.cookies.get(ACCESS_SESSION_COOKIE);

  if (!session?.value) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("access", "required");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/inbox/:path*", "/waiting/:path*", "/review/:path*", "/more/:path*"]
};
