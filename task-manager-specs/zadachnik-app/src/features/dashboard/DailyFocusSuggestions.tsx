import { TaskCard } from "@/features/tasks/TaskCard";
import type { TaskView } from "@/features/tasks/task-types";
import { FocusSlotControls } from "@/features/dashboard/FocusSlotControls";
import type { ConfirmedFocusSelection } from "@/lib/dashboard/focus-selection";
import type { DailyFocusRanking } from "@/lib/dashboard/focus-ranking";

type DailyFocusSuggestionsProps = DailyFocusRanking & {
  confirmedSelections: ConfirmedFocusSelection[];
  replacementCandidates: TaskView[];
};

export function DailyFocusSuggestions({
  suggestions,
  otherForToday,
  confirmedSelections,
  replacementCandidates
}: DailyFocusSuggestionsProps) {
  const confirmedBySlot = new Map(
    confirmedSelections.map((selection) => [selection.slot, selection])
  );
  const confirmedTaskIds = new Set(confirmedSelections.map((selection) => selection.taskId));
  const slots = [0, 1, 2].map((slot) => {
    const confirmed = confirmedBySlot.get(slot);
    const suggestion = suggestions[slot];
    const task = confirmed?.task ?? suggestion?.task ?? null;
    const reasons = confirmed
      ? suggestion?.task.id === confirmed.taskId
        ? suggestion.reasons
        : ["выбрано вручную"]
      : suggestion?.reasons ?? [];

    return { slot, confirmed, suggestion, task, reasons };
  });

  return (
    <section className="daily-focus" aria-labelledby="daily-focus-title">
      <div className="daily-focus__header">
        <div>
          <p className="eyebrow">Мягкий фокус</p>
          <h3 id="daily-focus-title">Предлагаю 3 главные задачи</h3>
          <p>Это только предложения. Выбор подтвердим отдельно.</p>
        </div>
      </div>

      {slots.every((slot) => !slot.task) ? (
        <div className="empty-state daily-focus__empty">
          <p>Пока нечего предложить в главный фокус.</p>
        </div>
      ) : (
        <div className="daily-focus__suggestions" data-testid="daily-focus-suggestions">
          {slots.map(({ slot, confirmed, task, reasons }) => task ? (
            <div
              className="daily-focus__suggestion"
              data-confirmed={confirmed ? "true" : "false"}
              data-testid={`focus-slot-${slot}`}
              key={`${slot}-${task.id}`}
            >
              <div className="daily-focus__suggestion-meta">
                <strong>{slot + 1}</strong>
                <span>{confirmed ? "Подтверждено" : "Предложение"}</span>
                <div>
                  <span>Почему:</span>
                  {reasons.map((reason) => (
                    <em key={reason}>{reason}</em>
                  ))}
                </div>
              </div>
              <TaskCard task={task} compact />
              <FocusSlotControls
                slot={slot}
                taskId={task.id}
                confirmed={Boolean(confirmed)}
                replacementCandidates={replacementCandidates.filter((candidate) => (
                  candidate.id !== task.id &&
                  (!confirmedTaskIds.has(candidate.id) || confirmed?.taskId === candidate.id)
                ))}
              />
            </div>
          ) : null)}
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
