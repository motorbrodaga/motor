import { NextResponse, type NextRequest } from "next/server";
import { requireApiSession, apiError } from "@/lib/api-session";
import { requireExplicitAction, normalizeIntakeLimit } from "@/lib/intake/intake-guards";
import { getTelegramMotorcodexChoices } from "@/lib/intake/telegram-provider";

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as { action?: unknown; limit?: unknown };
    requireExplicitAction(payload.action, "latest");
    const limit = normalizeIntakeLimit(payload.limit);
    const result = await getTelegramMotorcodexChoices(limit);

    return NextResponse.json(result);
  } catch (error) {
    return apiError(error);
  }
}
