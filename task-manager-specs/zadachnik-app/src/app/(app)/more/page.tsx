import Link from "next/link";

export default function MorePage() {
  return (
    <section className="page-section">
      <p className="eyebrow">Настройки</p>
      <h2>Еще</h2>
      <div className="settings-list">
        <Link href="/more/access">Приватная ссылка</Link>
      </div>
    </section>
  );
}
