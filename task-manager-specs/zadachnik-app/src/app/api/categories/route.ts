import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiError, requireApiSession } from "@/lib/api-session";
import { cleanText } from "@/lib/tasks/task-validation";

const colorPattern = /^#[0-9a-fA-F]{6}$/;

export async function GET(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  const categories = await prisma.category.findMany({
    where: { archivedAt: null },
    orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
  });

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      name?: unknown;
      color?: unknown;
    };
    const name = cleanText(payload.name);
    const color = cleanText(payload.color) ?? "#1f6f5f";

    if (!name) {
      throw new Error("Введите название категории.");
    }

    if (!colorPattern.test(color)) {
      throw new Error("Выберите цвет категории.");
    }

    const category = await prisma.category.create({
      data: { name, color }
    });

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
