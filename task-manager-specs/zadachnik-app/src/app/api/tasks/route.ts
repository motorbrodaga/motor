import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession, apiError } from "@/lib/api-session";
import { requireTitle } from "@/lib/tasks/task-validation";
import { taskInclude } from "@/lib/tasks/task-queries";

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const tasks = await prisma.task.findMany({
    where: {
      archivedAt: null,
      status: { not: "done" }
    },
    include: taskInclude,
    orderBy: [{ createdAt: "desc" }]
  });

  return NextResponse.json({ tasks });
}

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as { title?: unknown };
    const title = requireTitle(payload.title);

    const task = await prisma.task.create({
      data: {
        title,
        status: "inbox"
      },
      include: taskInclude
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
