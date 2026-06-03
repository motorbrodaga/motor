"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ActualTimeEditorProps = {
  taskId: string;
  actualMinutes: number | null;
};

export function ActualTimeEditor({ taskId, actualMinutes }: ActualTimeEditorProps) {
  const router = useRouter();
  const [savedMinutes, setSavedMinutes] = useState(actualMinutes);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(savedMinutes?.toString() ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setBusy(true);
    setError("");

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ actualMinutes: value })
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Не удалось сохранить время.");
      return;
    }

    const nextMinutes = value === "" ? null : Number(value);
    setSavedMinutes(Number.isFinite(nextMinutes) ? nextMinutes : null);
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div className="history-time-summary">
        {savedMinutes ? <span>Факт: {savedMinutes} мин</span> : null}
        <button className="secondary-button history-time-button" onClick={() => setEditing(true)}>
          {savedMinutes ? "Изменить время" : "Добавить время"}
        </button>
      </div>
    );
  }

  return (
    <div className="history-time-editor">
      <label className="field">
        <span>Фактическое время, мин</span>
        <input
          inputMode="numeric"
          min="0"
          max="1440"
          type="number"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <div className="history-time-editor__actions">
        <button className="primary-button" disabled={busy} onClick={save}>
          Сохранить
        </button>
        <button
          className="secondary-button"
          disabled={busy}
          onClick={() => {
            setEditing(false);
            setValue(savedMinutes?.toString() ?? "");
            setError("");
          }}
        >
          Отмена
        </button>
      </div>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
