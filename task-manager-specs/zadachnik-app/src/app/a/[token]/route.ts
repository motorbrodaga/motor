import { NextResponse, type NextRequest } from "next/server";
import { validateAccessToken } from "@/lib/access-tokens";
import { createAccessSessionCookie, setAccessSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const accessToken = await validateAccessToken(token);

  if (!accessToken) {
    return NextResponse.redirect(new URL("/?access=invalid", request.url));
  }

  await prisma.shellEvent.create({
    data: {
      kind: "access.validated",
      metadataJson: JSON.stringify({ tokenId: accessToken.id })
    }
  });

  const dashboardUrl = new URL("/dashboard", request.url);
  dashboardUrl.searchParams.set("sid", createAccessSessionCookie(accessToken.id));
  const response = NextResponse.redirect(dashboardUrl);
  setAccessSessionCookie(response, accessToken.id);
  return response;
}
