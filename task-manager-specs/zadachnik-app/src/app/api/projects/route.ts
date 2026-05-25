import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, requireApiSession } from "@/lib/api-session";
import { cleanText } from "@/lib/tasks/task-validation";

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const projects = await prisma.project.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" }
  });

  return NextResponse.json({ projects });
}

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      name?: unknown;
      description?: unknown;
    };
    const name = cleanText(payload.name);

    if (!name) {
      throw new Error("Введите название проекта.");
    }

    const project = await prisma.project.create({
      data: {
        name,
        description: cleanText(payload.description)
      }
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
