import { OrganizationManager } from "@/features/organization/OrganizationManager";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    where: { archivedAt: null },
    orderBy: [{ systemDefault: "desc" }, { name: "asc" }]
  });

  return (
    <section className="page-section">
      <p className="eyebrow">Организация</p>
      <h2>Категории</h2>
      <OrganizationManager
        kind="category"
        title="Категории"
        items={JSON.parse(JSON.stringify(categories))}
      />
    </section>
  );
}
