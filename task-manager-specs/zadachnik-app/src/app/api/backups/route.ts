import { NextResponse, type NextRequest } from "next/server";
import { requireApiSession } from "@/lib/api-session";
import { getLatestBackupRun } from "@/lib/backups/backup-service";

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const latest = await getLatestBackupRun();
  return NextResponse.json({ latest });
}
