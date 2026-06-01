import { NextResponse, type NextRequest } from "next/server";
import { apiError, requireApiSession } from "@/lib/api-session";
import {
  confirmDailyFocusSlot,
  getConfirmedFocusSelections
} from "@/lib/dashboard/focus-selection";

type FocusPayload = {
  slot?: unknown;
  taskId?: unknown;
};

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const selections = await getConfirmedFocusSelections();
  return NextResponse.json({ selections });
}

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as FocusPayload;
    const selections = await confirmDailyFocusSlot(payload.slot, payload.taskId);
    return NextResponse.json({ selections });
  } catch (error) {
    return apiError(error);
  }
}
