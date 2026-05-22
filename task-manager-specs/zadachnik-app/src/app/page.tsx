import Link from "next/link";

export default function HomePage() {
  return (
    <main className="public-screen">
      <section className="public-panel">
        <p className="eyebrow">Личный доступ</p>
        <h1>Задачник</h1>
        <p>
          Откройте приложение по приватной ссылке. После входа здесь будет
          доступна Панель.
        </p>
        <Link className="primary-link" href="/dashboard">
          Перейти в приложение
        </Link>
      </section>
    </main>
  );
}
