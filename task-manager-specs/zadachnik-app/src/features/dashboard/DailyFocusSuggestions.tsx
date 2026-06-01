import { TaskCard } from "@/features/tasks/TaskCard";
import type { DailyFocusRanking } from "@/lib/dashboard/focus-ranking";

type DailyFocusSuggestionsProps = DailyFocusRanking;

export function DailyFocusSuggestions({
  suggestions,
  otherForToday
}: DailyFocusSuggestionsProps) {
  return (
    <section className="daily-focus" aria-labelledby="daily-focus-title">
      <div className="daily-focus__header">
        <div>
          <p className="eyebrow">Мягкий фокус</p>
          <h3 id="daily-focus-title">Предлагаю 3 главные задачи</h3>
          <p>Это только предложения. Выбор подтвердим отдельно.</p>
        </div>
      </div>

      {suggestions.length === 0 ? (
        <div className="empty-state daily-focus__empty">
          <p>Пока нечего предложить в главный фокус.</p>
        </div>
      ) : (
        <div className="daily-focus__suggestions" data-testid="daily-focus-suggestions">
          {suggestions.map((suggestion, index) => (
            <div className="daily-focus__suggestion" key={suggestion.task.id}>
              <div className="daily-focus__suggestion-meta">
                <strong>{index + 1}</strong>
                <span>Предложение</span>
                <div>
                  <span>Почему:</span>
                  {suggestion.reasons.map((reason) => (
                    <em key={reason}>{reason}</em>
                  ))}
                </div>
              </div>
              <TaskCard task={suggestion.task} compact />
            </div>
          ))}
        </div>
      )}

      <div className="daily-focus__other" data-testid="other-for-today">
        <div className="daily-focus__other-header">
          <h4>Остальное на сегодня</h4>
          <span>{otherForToday.length}</span>
        </div>

        {otherForToday.length === 0 ? (
          <p>После предложенных главных задач на сегодня ничего не осталось.</p>
        ) : (
          <div className="daily-focus__other-list">
            {otherForToday.map((task) => (
              <TaskCard key={task.id} task={task} compact />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
