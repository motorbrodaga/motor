import type { NextRequest } from "next/server";

export function getRequestOrigin(request: NextRequest) {
  const host = request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");

  if (!host) {
    return request.nextUrl.origin;
  }

  return `${protocol}://${host}`;
}

export function getRequestUrl(request: NextRequest, pathname: string) {
  return new URL(pathname, getRequestOrigin(request));
}
