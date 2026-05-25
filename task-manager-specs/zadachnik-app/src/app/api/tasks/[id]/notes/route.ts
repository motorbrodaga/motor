import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, requireApiSession } from "@/lib/api-session";
import { cleanText } from "@/lib/tasks/task-validation";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const { id } = await context.params;
  const notes = await prisma.taskNote.findMany({
    where: {
      taskId: id,
      task: { archivedAt: null }
    },
    orderBy: { createdAt: "desc" }
  });

  return NextResponse.json({ notes });
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => ({}))) as { body?: unknown };
    const body = cleanText(payload.body);

    if (!body) {
      throw new Error("Введите текст заметки.");
    }

    const note = await prisma.taskNote.create({
      data: {
        taskId: id,
        body
      }
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
