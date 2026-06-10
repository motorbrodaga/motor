import { NextResponse, type NextRequest } from "next/server";
import { requireApiSession } from "@/lib/api-session";
import { createBackup } from "@/lib/backups/backup-service";

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const backup = await createBackup();
  return NextResponse.json({ backup }, { status: backup.status === "success" ? 201 : 500 });
}
