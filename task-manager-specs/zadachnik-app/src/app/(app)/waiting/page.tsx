import { TaskCard } from "@/features/tasks/TaskCard";
import type { TaskView } from "@/features/tasks/task-types";
import { getWaitingSections } from "@/lib/waiting/waiting-tasks";

export const dynamic = "force-dynamic";

type WaitingSectionProps = {
  title: string;
  description: string;
  tasks: TaskView[];
  empty: string;
};

function WaitingSection({ title, description, tasks, empty }: WaitingSectionProps) {
  return (
    <section className="waiting-section">
      <div className="waiting-section__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span>{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state waiting-section__empty">
          <p>{empty}</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} compact />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function WaitingPage() {
  const sections = await getWaitingSections();

  return (
    <section className="page-section waiting-page">
      <div>
        <p className="eyebrow">Люди</p>
        <h2>Ожидания</h2>
      </div>

      <WaitingSection
        title="ждут от меня"
        description="Задачи, где человеку нужен мой ответ или действие."
        tasks={sections.forMe}
        empty="Пока никто не ждет ответа от меня."
      />

      <WaitingSection
        title="я жду"
        description="Задачи, где следующий шаг зависит от другого человека."
        tasks={sections.forThem}
        empty="Пока я никого не жду."
      />

      <WaitingSection
        title="пора проверить"
        description="Мягкое напоминание по ожиданиям без даты, которые висят неделю."
        tasks={sections.checkIn}
        empty="Старых ожиданий без даты нет."
      />
    </section>
  );
}
