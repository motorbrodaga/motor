import { IntakePageClient } from "@/features/intake/IntakePageClient";

export const dynamic = "force-dynamic";

export default function IntakePage() {
  return (
    <section className="page-section intake-page">
      <p className="eyebrow">Импорт</p>
      <h2>Telegram и Gmail</h2>
      <IntakePageClient />
    </section>
  );
}
