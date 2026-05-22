import { AccessManager } from "@/features/access/AccessManager";

export default function AccessPage() {
  return (
    <section className="page-section">
      <p className="eyebrow">Доступ</p>
      <h2>Приватная ссылка</h2>
      <AccessManager />
    </section>
  );
}
