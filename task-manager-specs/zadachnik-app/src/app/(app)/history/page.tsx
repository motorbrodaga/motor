import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { TaskCard } from "@/features/tasks/TaskCard";
import { formatDate } from "@/features/tasks/task-formatters";
import { getCompletionHistory, type HistorySection } from "@/lib/history/completion-history";

export const dynamic = "force-dynamic";

function HistoryTaskMeta({ completedAt }: { completedAt: string | null }) {
  return (
    <div className="history-task-meta">
      {completedAt ? <span>Закрыто: {formatDate(completedAt)}</span> : null}
    </div>
  );
}

function HistorySectionView({ section }: { section: HistorySection }) {
  return (
    <section className="history-section">
      <div className="history-section__header">
        <div>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </div>
        <span>{section.tasks.length}</span>
      </div>

      {section.tasks.length === 0 ? (
        <div className="empty-state history-section__empty">
          <p>{section.empty}</p>
        </div>
      ) : (
        <div className="history-section__tasks">
          {section.tasks.map((task) => (
            <div className="history-task" key={task.id}>
              <TaskCard task={task} compact />
              <HistoryTaskMeta completedAt={task.completedAt} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default async function HistoryPage() {
  const history = await getCompletionHistory();
  const completedCount = history.sections.reduce((total, section) => total + section.tasks.length, 0);

  return (
    <section className="page-section history-page">
      <div className="history-page__top">
        <div>
          <p className="eyebrow">Память недели</p>
          <h2>История</h2>
        </div>
        <div className="history-page__date">
          <span>Неделя от {formatDate(history.weekStart)}</span>
          <strong>{completedCount} закрыто</strong>
        </div>
      </div>

      <section className="history-intro">
        <div className="history-intro__icon" aria-hidden="true">
          <CheckCircle2 size={22} />
        </div>
        <div>
          <h3>Что уже сделано</h3>
          <p>Короткий список закрытых задач, чтобы можно было восстановить день и неделю без раскопок в памяти.</p>
        </div>
      </section>

      {completedCount === 0 ? (
        <div className="empty-state">
          <p>На этой неделе пока нет закрытых задач. Когда что-то завершится, оно появится здесь.</p>
        </div>
      ) : null}

      {history.sections.map((section) => (
        <HistorySectionView key={section.id} section={section} />
      ))}

      <Link className="secondary-button history-page__review-link" href="/review">
        Открыть мягкий обзор
      </Link>
    </section>
  );
}
