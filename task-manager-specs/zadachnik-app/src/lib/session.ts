import { createHmac, timingSafeEqual } from "node:crypto";
import type { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { accessTokenPepper } from "@/lib/env";
import { ACCESS_SESSION_COOKIE } from "@/lib/session-cookie";

export { ACCESS_SESSION_COOKIE };

function signTokenId(tokenId: string) {
  return createHmac("sha256", accessTokenPepper()).update(tokenId).digest("hex");
}

function safeEqual(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return timingSafeEqual(aBuffer, bBuffer);
}

export function createAccessSessionCookie(tokenId: string) {
  return `${tokenId}.${signTokenId(tokenId)}`;
}

export function setAccessSessionCookie(response: NextResponse, tokenId: string) {
  response.cookies.set({
    name: ACCESS_SESSION_COOKIE,
    value: createAccessSessionCookie(tokenId),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365
  });
}

export function parseAccessSessionCookie(value?: string | null) {
  if (!value) {
    return null;
  }

  const [tokenId, signature] = value.split(".");

  if (!tokenId || !signature) {
    return null;
  }

  const expectedSignature = signTokenId(tokenId);

  if (!safeEqual(signature, expectedSignature)) {
    return null;
  }

  return tokenId;
}

export async function getActiveSession(tokenId?: string | null) {
  if (!tokenId) {
    return null;
  }

  return prisma.accessToken.findFirst({
    where: { id: tokenId, active: true }
  });
}
