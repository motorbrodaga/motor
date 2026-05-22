import { QuickCaptureEntry } from "@/features/capture/QuickCaptureEntry";

export function DashboardHome() {
  return (
    <section className="dashboard-home">
      <div className="dashboard-home__top">
        <div>
          <p className="eyebrow">Сегодня</p>
          <h2>Панель</h2>
        </div>
        <QuickCaptureEntry />
      </div>

      <div className="dashboard-band">
        <h3>Главное на сегодня</h3>
        <p>Задачи дня появятся здесь после подключения модели задач.</p>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <h3>Входящие</h3>
          <p>Место для новых задач, которые нужно разобрать.</p>
        </section>
        <section className="dashboard-panel">
          <h3>Ожидания</h3>
          <p>Здесь будут задачи, связанные с людьми и ответами.</p>
        </section>
      </div>
    </section>
  );
}
