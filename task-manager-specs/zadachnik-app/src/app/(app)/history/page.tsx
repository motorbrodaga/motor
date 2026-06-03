import Link from "next/link";
import type { CSSProperties } from "react";
import { CheckCircle2 } from "lucide-react";
import { ActualTimeEditor } from "@/features/history/ActualTimeEditor";
import type { TaskView } from "@/features/tasks/task-types";
import { formatDate, formatMinutes } from "@/features/tasks/task-formatters";
import {
  getCompletionHistory,
  type CompletionStats,
  type HistorySection
} from "@/lib/history/completion-history";

export const dynamic = "force-dynamic";

function HistoryStats({ stats }: { stats: CompletionStats }) {
  return (
    <section className="history-stats" aria-label="Итоги выполненного">
      <div className="history-stat">
        <span>закрыто</span>
        <strong>{stats.completedCount}</strong>
      </div>
      <div className="history-stat">
        <span>время</span>
        <strong>{stats.totalActualMinutes ? formatMinutes(stats.totalActualMinutes) : "пока нет"}</strong>
      </div>
      <div className="history-stat history-stat--categories">
        <span>категории</span>
        <div className="history-category-list">
          {stats.categories.length === 0 ? (
            <strong>пока нет</strong>
          ) : (
            stats.categories.map((category) => (
              <strong
                key={category.id}
                style={{ "--category-color": category.color } as CSSProperties}
              >
                <i aria-hidden="true" />
                {category.name}: {category.count}
              </strong>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function HistoryTask({ task }: { task: TaskView }) {
  const categoryStyle = task.category
    ? ({ "--category-color": task.category.color } as CSSProperties)
    : undefined;

  return (
    <article className="history-task-card" style={categoryStyle}>
      <div className="history-task-card__content">
        <Link className="history-task-card__title" href={`/tasks/${task.id}`}>
          {task.title}
        </Link>
        <div className="history-task-card__meta">
          {task.completedAt ? <span>Закрыто: {formatDate(task.completedAt)}</span> : null}
          {task.category ? (
            <span className="history-task-card__category">
              <i aria-hidden="true" />
              {task.category.name}
            </span>
          ) : null}
        </div>
      </div>
      <ActualTimeEditor taskId={task.id} actualMinutes={task.actualMinutes} />
    </article>
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
            <HistoryTask key={task.id} task={task} />
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

      <HistoryStats stats={history.stats} />

      {history.sections.map((section) => (
        <HistorySectionView key={section.id} section={section} />
      ))}

      <Link className="secondary-button history-page__review-link" href="/review">
        Открыть мягкий обзор
      </Link>
    </section>
  );
}
