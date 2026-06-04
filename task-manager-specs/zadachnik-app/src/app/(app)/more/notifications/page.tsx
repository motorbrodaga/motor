import Link from "next/link";
import { NotificationSettings } from "@/features/notifications/NotificationSettings";

export const dynamic = "force-dynamic";

export default function NotificationsPage() {
  return (
    <section className="page-section notification-page">
      <Link className="secondary-button task-detail__back" href="/more">
        Ещё
      </Link>
      <p className="eyebrow">Настройки</p>
      <h2>Уведомления</h2>
      <NotificationSettings />
    </section>
  );
}
