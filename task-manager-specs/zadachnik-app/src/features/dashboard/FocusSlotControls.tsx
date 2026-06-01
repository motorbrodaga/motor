"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { TaskView } from "@/features/tasks/task-types";

type FocusSlotControlsProps = {
  slot: number;
  taskId: string;
  confirmed: boolean;
  replacementCandidates: TaskView[];
};

async function saveFocusSlot(slot: number, taskId: string) {
  const response = await fetch("/api/daily-focus", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ slot, taskId })
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? "Не удалось сохранить фокус.");
  }
}

export function FocusSlotControls({
  slot,
  taskId,
  confirmed,
  replacementCandidates
}: FocusSlotControlsProps) {
  const router = useRouter();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(nextTaskId: string) {
    setBusy(true);
    setError("");

    try {
      await saveFocusSlot(slot, nextTaskId);
      setPickerOpen(false);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить фокус.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="focus-slot-controls">
      <div className="focus-slot-controls__actions">
        <button
          className="primary-button"
          disabled={busy || confirmed}
          onClick={() => run(taskId)}
          type="button"
        >
          {confirmed ? "Подтверждено" : "Подтвердить"}
        </button>
        <button
          className="secondary-button"
          disabled={busy}
          onClick={() => setPickerOpen((current) => !current)}
          type="button"
        >
          Заменить
        </button>
      </div>

      {pickerOpen ? (
        <div className="focus-slot-controls__picker">
          {replacementCandidates.length === 0 ? (
            <p>Нет другой открытой задачи для замены.</p>
          ) : (
            replacementCandidates.slice(0, 8).map((candidate) => (
              <button
                className="secondary-button"
                disabled={busy}
                key={candidate.id}
                onClick={() => run(candidate.id)}
                type="button"
              >
                {candidate.title}
              </button>
            ))
          )}
        </div>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
