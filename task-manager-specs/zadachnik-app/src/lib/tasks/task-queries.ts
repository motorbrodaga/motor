import { prisma } from "@/lib/db";

export const taskInclude = {
  category: true,
  project: true,
  contexts: {
    include: {
      context: true
    },
    orderBy: {
      context: {
        name: "asc" as const
      }
    }
  }
};

export const taskDetailInclude = {
  ...taskInclude,
  calendarLink: true,
  notes: {
    orderBy: {
      createdAt: "desc" as const
    }
  }
};

export async function getOrganizationOptions() {
  const [categories, contexts, projects] = await Promise.all([
    prisma.category.findMany({
      where: { archivedAt: null },
      orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
    }),
    prisma.context.findMany({
      where: { archivedAt: null },
      orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
    }),
    prisma.project.findMany({
      where: { archivedAt: null },
      orderBy: { name: "asc" }
    })
  ]);

  return { categories, contexts, projects };
}
