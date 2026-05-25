import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, requireApiSession } from "@/lib/api-session";
import { cleanText } from "@/lib/tasks/task-validation";

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const contexts = await prisma.context.findMany({
    where: { archivedAt: null },
    orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
  });

  return NextResponse.json({ contexts });
}

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as { name?: unknown };
    const name = cleanText(payload.name);

    if (!name) {
      throw new Error("Введите название контекста.");
    }

    const context = await prisma.context.create({
      data: { name }
    });

    return NextResponse.json({ context }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
