import { OrganizationManager } from "@/features/organization/OrganizationManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ContextsPage() {
  const contexts = await prisma.context.findMany({
    where: { archivedAt: null },
    orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
  });

  return (
    <section className="page-section">
      <p className="eyebrow">Организация</p>
      <h2>Контексты</h2>
      <OrganizationManager
        kind="context"
        title="Контексты"
        items={JSON.parse(JSON.stringify(contexts))}
      />
    </section>
  );
}
