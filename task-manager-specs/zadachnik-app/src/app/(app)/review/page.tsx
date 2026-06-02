import { TaskCard } from "@/features/tasks/TaskCard";
import type { TaskView } from "@/features/tasks/task-types";
import { ReviewTaskActions } from "@/features/review/ReviewTaskActions";
import { formatDate } from "@/features/tasks/task-formatters";
import { getWeeklyReview, type ReviewSection } from "@/lib/review/weekly-review";

export const dynamic = "force-dynamic";

function ReviewTask({ task }: { task: TaskView }) {
  return (
    <div className="review-task">
      <TaskCard task={task} compact />
      <ReviewTaskActions taskId={task.id} currentImportance={task.importance} />
    </div>
  );
}

function ReviewTaskSection({ section }: { section: ReviewSection }) {
  return (
    <section className="review-section">
      <div className="review-section__header">
        <div>
          <h3>{section.title}</h3>
          <p>{section.description}</p>
        </div>
        <span>{section.tasks.length}</span>
      </div>

      {section.tasks.length === 0 ? (
        <div className="empty-state review-section__empty">
          <p>{section.empty}</p>
        </div>
      ) : (
        <div className="review-section__tasks">
          {section.tasks.map((task) => (
            <ReviewTask key={`${section.id}-${task.id}`} task={task} />
          ))}
        </div>
      )}
    </section>
  );
}

export default async function ReviewPage() {
  const review = await getWeeklyReview();
  const visibleTaskCount = review.sections.reduce((total, section) => total + section.tasks.length, 0);

  return (
    <section className="page-section review-page">
      <div className="review-page__top">
        <div>
          <p className="eyebrow">Возврат внимания</p>
          <h2>Обзор</h2>
        </div>
        <div className="review-page__date">
          <span>Неделя от {formatDate(review.weekStart)}</span>
          <strong>{review.isMonday ? "понедельник" : "можно открыть сейчас"}</strong>
        </div>
      </div>

      <section className="review-intro">
        <h3>Мягкий недельный обзор</h3>
        <p>
          Здесь собраны задачи, которые могли выпасть из внимания. Их можно спокойно
          оставить, назначить на день, отметить важными или открыть подробнее.
        </p>
      </section>

      {visibleTaskCount === 0 && review.categories.length === 0 ? (
        <div className="empty-state">
          <p>На этой неделе нечего возвращать. Можно спокойно идти дальше.</p>
        </div>
      ) : null}

      {review.sections.map((section) => (
        <ReviewTaskSection key={section.id} section={section} />
      ))}

      <section className="review-section">
        <div className="review-section__header">
          <div>
            <h3>накопилось по категориям</h3>
            <p>Где открытой работы стало больше всего.</p>
          </div>
          <span>{review.categories.length}</span>
        </div>

        {review.categories.length === 0 ? (
          <div className="empty-state review-section__empty">
            <p>Категорий с открытыми задачами пока нет.</p>
          </div>
        ) : (
          <div className="review-categories">
            {review.categories.map((category) => (
              <article
                className="review-category"
                key={category.id}
                style={{ "--category-color": category.color } as React.CSSProperties}
              >
                <div className="review-category__title">
                  <span aria-hidden="true" />
                  <h4>{category.name}</h4>
                  <strong>{category.openCount}</strong>
                </div>
                <div className="review-category__tasks">
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
