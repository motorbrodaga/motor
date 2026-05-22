import { NextResponse, type NextRequest } from "next/server";
import { validateAccessToken } from "@/lib/access-tokens";
import { getRequestUrl } from "@/lib/request-origin";
import { createAccessSessionCookie, setAccessSessionCookie } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const accessToken = await validateAccessToken(token);

  if (!accessToken) {
    return NextResponse.redirect(getRequestUrl(request, "/?access=invalid"));
  }

  await prisma.shellEvent.create({
    data: {
      kind: "access.validated",
      metadataJson: JSON.stringify({ tokenId: accessToken.id })
    }
  });

  const dashboardUrl = getRequestUrl(request, "/dashboard");
  dashboardUrl.searchParams.set("sid", createAccessSessionCookie(accessToken.id));
  const response = NextResponse.redirect(dashboardUrl);
  setAccessSessionCookie(response, accessToken.id);
  return response;
}
