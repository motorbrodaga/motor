import { NextResponse, type NextRequest } from "next/server";
import { requireApiSession, apiError } from "@/lib/api-session";
import {
  normalizeIntakeLimit,
  requireExplicitAction,
  requireSearchQuery
} from "@/lib/intake/intake-guards";
import { searchGmailChoices } from "@/lib/intake/gmail-provider";

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      action?: unknown;
      query?: unknown;
      limit?: unknown;
    };
    requireExplicitAction(payload.action, "search");
    const query = requireSearchQuery(payload.query);
    const limit = normalizeIntakeLimit(payload.limit);
    const result = await searchGmailChoices(query, limit);

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error);
  }
}
