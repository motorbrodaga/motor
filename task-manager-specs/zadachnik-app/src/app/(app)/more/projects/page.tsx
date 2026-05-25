import { OrganizationManager } from "@/features/organization/OrganizationManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" }
  });

  return (
    <section className="page-section">
      <p className="eyebrow">Организация</p>
      <h2>Проекты</h2>
      <OrganizationManager
        kind="project"
        title="Проекты"
        items={JSON.parse(JSON.stringify(projects))}
      />
    </section>
  );
}
