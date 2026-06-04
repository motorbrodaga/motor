import { NextResponse, type NextRequest } from "next/server";
import { requireApiSession, apiError } from "@/lib/api-session";
import { prepareSourceTask } from "@/lib/intake/prepare-source-task";
import { getOrganizationOptions } from "@/lib/tasks/task-queries";

export async function POST(request: NextRequest) {
  const { response } = await requireApiSession(request);

  if (response) {
    return response;
  }

  try {
    const payload = (await request.json().catch(() => ({}))) as {
      sourceText?: unknown;
      sourceLabel?: unknown;
    };
    const { categories } = await getOrganizationOptions();
    const interpretation = prepareSourceTask({
      sourceText: payload.sourceText,
      sourceLabel: payload.sourceLabel,
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name
      }))
    });

    return NextResponse.json({
      interpretation,
      categoryOptions: categories.map((category) => ({
        id: category.id,
        name: category.name
      }))
    });
  } catch (error) {
    return apiError(error);
  }
}
