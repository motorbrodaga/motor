"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarDays, Check, Clock, Flame, Star, Trash2 } from "lucide-react";
import {
  archiveTask as archiveOfflineAwareTask,
  patchTask as patchOfflineAwareTask
} from "@/features/offline/task-client";
import type { TaskView } from "@/features/tasks/task-types";
import { TaskQuickActions } from "@/features/tasks/TaskQuickActions";
import {
  formatDate,
  formatMinutes,
  statusLabels,
  waitingDirectionLabels
} from "@/features/tasks/task-formatters";
import type { WaitingDirection } from "@/lib/tasks/task-validation";

type TaskCardProps = {
  task: TaskView;
  compact?: boolean;
};

async function patchTask(taskId: string, body: Record<string, unknown>) {
  await patchOfflineAwareTask(taskId, body);
}

async function archiveTask(taskId: string) {
  await archiveOfflineAwareTask(taskId);
}

export function TaskCard({ task, compact = false }: TaskCardProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");

    try {
      await action();
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить.");
    } finally {
      setBusy(false);
    }
  }

  const categoryStyle = task.category
    ? ({ "--category-color": task.category.color } as React.CSSProperties)
    : undefined;

  return (
    <article className="task-card" style={categoryStyle}>
      <div className="task-card__main">
        <button
          className="task-card__check"
          aria-label="Выполнить"
          disabled={busy}
          onClick={() => run(() => patchTask(task.id, { status: "done" }))}
        >
          <Check size={18} aria-hidden="true" />
        </button>

        <div className="task-card__content">
          <Link className="task-card__title" href={`/tasks/${task.id}`}>
            {task.title}
          </Link>

          <div className="task-card__meta">
            <span>{statusLabels[task.status as keyof typeof statusLabels] ?? task.status}</span>
            {task.category ? (
              <span className="task-card__category">
                <span className="task-card__swatch" aria-hidden="true" />
                {task.category.name}
              </span>
            ) : null}
            {task.project ? <span>{task.project.name}</span> : null}
            {task.contexts.map(({ context }) => (
              <span key={context.id}>{context.name}</span>
            ))}
          </div>

          <div className="task-card__signals">
            {task.doDate ? (
              <span>
                <CalendarDays size={14} aria-hidden="true" /> День: {formatDate(task.doDate)}
              </span>
            ) : null}
            {task.dueDate ? (
              <span>
                <Clock size={14} aria-hidden="true" /> Срок: {formatDate(task.dueDate)}
              </span>
            ) : null}
            {task.importance === "important" ? (
              <span>
                <Star size={14} aria-hidden="true" /> Важная
              </span>
            ) : null}
            {task.isUrgent ? (
              <span className="task-card__urgent">
                <Flame size={14} aria-hidden="true" /> Срочно
              </span>
            ) : null}
            {task.estimatedMinutes ? <span>План: {formatMinutes(task.estimatedMinutes)}</span> : null}
            {task.actualMinutes ? <span>Факт: {formatMinutes(task.actualMinutes)}</span> : null}
            {task.sourceLabel ? <span>Источник: {task.sourceLabel}</span> : null}
            {task.personLabel ? <span>Человек: {task.personLabel}</span> : null}
            {task.waitingDirection ? (
              <span>
                Ожидание:{" "}
                {waitingDirectionLabels[task.waitingDirection as WaitingDirection] ??
                  task.waitingDirection}
              </span>
            ) : null}
            {task.responseDueDate ? (
              <span>
                <Clock size={14} aria-hidden="true" /> Ответить до:{" "}
                {formatDate(task.responseDueDate)}
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {!compact ? (
        <>
          <TaskQuickActions taskId={task.id} currentImportance={task.importance} />
          <div className="task-card__actions">
            <button
              className="secondary-button task-card__icon"
              aria-label="Скрыть задачу"
              disabled={busy}
              onClick={() => run(() => archiveTask(task.id))}
            >
              <Trash2 size={17} aria-hidden="true" />
            </button>
          </div>
        </>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}
    </article>
  );
}
