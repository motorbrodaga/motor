import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireApiSession, apiError } from "@/lib/api-session";
import {
  optionalIdList,
  validateTaskPatch,
  type TaskInput
} from "@/lib/tasks/task-validation";
import { taskDetailInclude } from "@/lib/tasks/task-queries";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function findTask(id: string) {
  return prisma.task.findFirst({
    where: { id, archivedAt: null },
    include: taskDetailInclude
  });
}

export async function GET(request: NextRequest, context: RouteContext) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const { id } = await context.params;
  const task = await findTask(id);

  if (!task) {
    return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
  }

  return NextResponse.json({ task });
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const { id } = await context.params;
    const payload = (await request.json().catch(() => ({}))) as TaskInput;
    const contextIds = "contextIds" in payload
      ? optionalIdList(payload.contextIds)
      : undefined;
    const data = validateTaskPatch(payload);

    const task = await prisma.$transaction(async (tx) => {
      if ("waitingDirection" in data) {
        const current = await tx.task.findUnique({
          where: { id },
          select: { waitingDirection: true, waitingSince: true }
        });

        if (typeof data.waitingDirection === "string") {
          data.waitingSince =
            current?.waitingDirection === data.waitingDirection && current.waitingSince
              ? current.waitingSince
              : new Date();
        } else {
          data.waitingSince = null;
        }
      }

      if (contextIds) {
        await tx.taskContext.deleteMany({ where: { taskId: id } });

        if (contextIds.length > 0) {
          await tx.taskContext.createMany({
            data: Array.from(new Set(contextIds)).map((contextId) => ({ taskId: id, contextId }))
          });
        }
      }

      return tx.task.update({
        where: { id },
        data,
        include: taskDetailInclude
      });
    });

    return NextResponse.json({ task });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const { id } = await context.params;

  await prisma.task.update({
    where: { id },
    data: { archivedAt: new Date() }
  });

  return NextResponse.json({ ok: true });
}
