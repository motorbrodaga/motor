import { NextResponse, type NextRequest } from "next/server";
import { requireApiSession } from "@/lib/api-session";
import {
  applySyncMutation,
  getOpenTasksForSync,
  type SyncMutation
} from "@/lib/sync/task-sync";

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const payload = (await request.json().catch(() => ({}))) as {
    mutations?: SyncMutation[];
  };
  const mutations = Array.isArray(payload.mutations) ? payload.mutations : [];
  const results = [];
  const changedTasks = [];

  for (const mutation of mutations.sort((a, b) =>
    String(a.clientUpdatedAt).localeCompare(String(b.clientUpdatedAt))
  )) {
    const applied = await applySyncMutation(mutation);
    results.push(applied.result);

    if (applied.task) {
      changedTasks.push(applied.task);
    }
  }

  const tasks = await getOpenTasksForSync();

  return NextResponse.json({ results, changedTasks, tasks });
}
