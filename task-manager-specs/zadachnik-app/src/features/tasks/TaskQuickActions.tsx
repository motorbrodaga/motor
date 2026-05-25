"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type TaskQuickActionsProps = {
  taskId: string;
  currentImportance: string;
};

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

function addDays(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInput(date);
}

export function TaskQuickActions({ taskId, currentImportance }: TaskQuickActionsProps) {
  const router = useRouter();
  const [customDate, setCustomDate] = useState("");
  const [note, setNote] = useState("");
  const [personLabel, setPersonLabel] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function request(path: string, body: Record<string, unknown>, method = "PATCH") {
    setBusy(true);
    setError("");

    const response = await fetch(path, {
      method,
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Не удалось сохранить.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="quick-actions">
      <div className="quick-actions__buttons">
        <button
          className="secondary-button"
          disabled={busy}
          onClick={() => request(`/api/tasks/${taskId}`, { status: "done" })}
        >
          Выполнить
        </button>
        <button
          className="secondary-button"
          disabled={busy}
          onClick={() => request(`/api/tasks/${taskId}`, { doDate: addDays(1) })}
        >
          Завтра
        </button>
        <button
          className="secondary-button"
          disabled={busy}
          onClick={() => request(`/api/tasks/${taskId}`, { doDate: addDays(7) })}
        >
          Через неделю
        </button>
        <button
          className="secondary-button"
          disabled={busy}
          onClick={() =>
            request(`/api/tasks/${taskId}`, {
              importance: currentImportance === "important" ? "normal" : "important"
            })
          }
        >
          Важность
        </button>
      </div>

      <div className="quick-actions__inline">
        <label className="field">
          <span>Выбрать дату</span>
          <input
            type="date"
            value={customDate}
            onChange={(event) => setCustomDate(event.target.value)}
          />
        </label>
        <button
          className="secondary-button"
          disabled={busy || !customDate}
          onClick={() => request(`/api/tasks/${taskId}`, { doDate: customDate })}
        >
          Перенести
        </button>
      </div>

      <div className="quick-actions__inline">
        <label className="field">
          <span>Заметка</span>
          <input value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <button
          className="secondary-button"
          disabled={busy || !note.trim()}
          onClick={() => {
            void request(`/api/tasks/${taskId}/notes`, { body: note }, "POST");
            setNote("");
          }}
        >
          Добавить заметку
        </button>
      </div>

      <div className="quick-actions__inline">
        <label className="field">
          <span>Человек</span>
          <input
            value={personLabel}
            onChange={(event) => setPersonLabel(event.target.value)}
          />
        </label>
        <button
          className="secondary-button"
          disabled={busy || !personLabel.trim()}
          onClick={() => request(`/api/tasks/${taskId}`, { personLabel })}
        >
          Назначить
        </button>
      </div>

      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
