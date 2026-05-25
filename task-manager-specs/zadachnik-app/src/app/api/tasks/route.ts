import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession, apiError } from "@/lib/api-session";
import {
  optionalIdList,
  requireTitle,
  validateTaskPatch,
  type TaskInput
} from "@/lib/tasks/task-validation";
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
    const payload = (await request.json().catch(() => ({}))) as TaskInput;
    const title = requireTitle(payload.title);
    const data = validateTaskPatch(payload);
    const contextIds = "contextIds" in payload ? optionalIdList(payload.contextIds) : [];

    delete data.title;

    const task = await prisma.$transaction(async (tx) => {
      const created = await tx.task.create({
        data: {
          ...data,
          title,
          status: typeof data.status === "string" ? data.status : "inbox"
        }
      });

      if (contextIds.length > 0) {
        await tx.taskContext.createMany({
          data: Array.from(new Set(contextIds)).map((contextId) => ({
            taskId: created.id,
            contextId
          }))
        });
      }

      return tx.task.findUniqueOrThrow({
        where: { id: created.id },
        include: taskInclude
      });
    });

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
