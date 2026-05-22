import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_SESSION_COOKIE } from "@/lib/session-cookie";

export default async function HomePage() {
  const cookieStore = await cookies();

  if (cookieStore.get(ACCESS_SESSION_COOKIE)?.value) {
    redirect("/dashboard");
  }

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
