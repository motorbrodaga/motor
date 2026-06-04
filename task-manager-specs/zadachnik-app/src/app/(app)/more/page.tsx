import Link from "next/link";

export default function MorePage() {
  return (
    <section className="page-section">
      <p className="eyebrow">Настройки</p>
      <h2>Еще</h2>
      <div className="settings-list">
        <Link href="/history">История</Link>
        <Link href="/more/intake">Импорт из Telegram и Gmail</Link>
        <Link href="/more/notifications">Уведомления</Link>
        <Link href="/more/access">Приватная ссылка</Link>
        <Link href="/more/categories">Категории</Link>
        <Link href="/more/contexts">Контексты</Link>
        <Link href="/more/projects">Проекты</Link>
      </div>
    </section>
  );
}
