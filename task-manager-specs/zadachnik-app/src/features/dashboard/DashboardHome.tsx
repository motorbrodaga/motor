import { QuickCaptureEntry } from "@/features/capture/QuickCaptureEntry";
import { DailyFocusSuggestions } from "@/features/dashboard/DailyFocusSuggestions";
import { TaskCard } from "@/features/tasks/TaskCard";
import type { TaskView } from "@/features/tasks/task-types";
import { getDashboardSections } from "@/lib/dashboard/dashboard-sections";
import { getConfirmedFocusSelections } from "@/lib/dashboard/focus-selection";
import { rankDailyFocusTasks } from "@/lib/dashboard/focus-ranking";

export const dynamic = "force-dynamic";

type DashboardTaskSectionProps = {
  title: string;
  description: string;
  tasks: TaskView[];
  empty: string;
};

function DashboardTaskSection({ title, description, tasks, empty }: DashboardTaskSectionProps) {
  return (
    <section className="dashboard-section">
      <div className="dashboard-section__header">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <span>{tasks.length}</span>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state dashboard-section__empty">
          <p>{empty}</p>
        </div>
      ) : (
        <div className="task-list dashboard-section__tasks">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} compact />
          ))}
        </div>
      )}
    </section>
  );
}

export async function DashboardHome() {
  const [sections, confirmedSelections] = await Promise.all([
    getDashboardSections(),
    getConfirmedFocusSelections()
  ]);
  const focus = rankDailyFocusTasks(sections.openTasks, sections.today);
  const confirmedTaskIds = new Set(confirmedSelections.map((selection) => selection.taskId));
  const otherForToday = focus.otherForToday.filter((task) => !confirmedTaskIds.has(task.id));

  return (
    <section className="dashboard-home">
      <div className="dashboard-home__top">
        <div>
          <p className="eyebrow">Сегодня</p>
          <h2>Панель</h2>
        </div>
        <QuickCaptureEntry />
      </div>

      <DailyFocusSuggestions
        suggestions={focus.suggestions}
        otherForToday={otherForToday}
        confirmedSelections={confirmedSelections}
        replacementCandidates={sections.openTasks}
      />

      <DashboardTaskSection
        title="Сегодня"
        description="То, что уже назначено на этот день."
        tasks={sections.today}
        empty="На сегодня задач нет. Можно спокойно выбрать главное вручную."
      />

      <div className="dashboard-grid">
        <DashboardTaskSection
          title="Просрочено"
          description="Срок уже прошел, стоит вернуть в поле зрения."
          tasks={sections.overdue}
          empty="Просроченных задач нет."
        />
        <DashboardTaskSection
          title="Ожидания"
          description="Задачи с человеком и понятным направлением ожидания."
          tasks={sections.waiting}
          empty="Ожиданий пока нет."
        />
      </div>

      <DashboardTaskSection
        title="Важное без срока"
        description="Важные задачи, которым еще не назначен дедлайн."
        tasks={sections.importantWithoutDueDate}
        empty="Важных задач без срока нет."
      />

      <section className="dashboard-section">
        <div className="dashboard-section__header">
          <div>
            <h3>Категории</h3>
            <p>Где накопилась открытая работа.</p>
          </div>
          <span>{sections.categories.length}</span>
        </div>

        {sections.categories.length === 0 ? (
          <div className="empty-state dashboard-section__empty">
            <p>Открытых задач по категориям пока нет.</p>
          </div>
        ) : (
          <div className="dashboard-categories">
            {sections.categories.map((category) => (
              <article
                className="dashboard-category"
                key={category.id}
                style={{ "--category-color": category.color } as React.CSSProperties}
              >
                <div className="dashboard-category__title">
                  <span aria-hidden="true" />
                  <h4>{category.name}</h4>
                  <strong>{category.openCount}</strong>
                </div>
                <div className="dashboard-category__tasks">
                  {category.recentTasks.map((task) => (
                    <TaskCard key={task.id} task={task} compact />
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
