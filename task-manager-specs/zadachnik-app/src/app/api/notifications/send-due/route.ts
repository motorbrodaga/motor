import { NextResponse, type NextRequest } from "next/server";
import { apiError, requireApiSession } from "@/lib/api-session";
import { sendDueNotifications } from "@/lib/notifications/scheduler";

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const result = await sendDueNotifications();
    return NextResponse.json(result);
  } catch (error) {
    return apiError(error);
  }
}
