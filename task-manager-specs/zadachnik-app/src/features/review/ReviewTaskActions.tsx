"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CalendarPlus, Check, ExternalLink, Star } from "lucide-react";

type ReviewTaskActionsProps = {
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

async function patchTask(taskId: string, body: Record<string, unknown>) {
  const response = await fetch(`/api/tasks/${taskId}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(payload.error ?? "Не удалось сохранить.");
  }
}

export function ReviewTaskActions({ taskId, currentImportance }: ReviewTaskActionsProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [kept, setKept] = useState(false);
  const [error, setError] = useState("");

  async function run(body: Record<string, unknown>) {
    setBusy(true);
    setError("");

    try {
      await patchTask(taskId, body);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="review-task-actions">
      <button className="secondary-button" type="button" disabled={busy || kept} onClick={() => setKept(true)}>
        {kept ? "Оставлено" : "Оставить"}
      </button>
      <button
        className="secondary-button"
        type="button"
        disabled={busy}
        onClick={() => run({ doDate: addDays(1) })}
      >
        <CalendarPlus size={15} aria-hidden="true" /> Завтра
      </button>
      <button
        className="secondary-button"
        type="button"
        disabled={busy}
        onClick={() => run({ doDate: addDays(7) })}
      >
        <CalendarPlus size={15} aria-hidden="true" /> Через неделю
      </button>
      <button
        className="secondary-button"
        type="button"
        disabled={busy}
        onClick={() =>
          run({ importance: currentImportance === "important" ? "normal" : "important" })
        }
      >
        <Star size={15} aria-hidden="true" /> Важно
      </button>
      <button
        className="secondary-button"
        type="button"
        disabled={busy}
        onClick={() => run({ status: "done" })}
      >
        <Check size={15} aria-hidden="true" /> Готово
      </button>
      <Link className="secondary-button" href={`/tasks/${taskId}`}>
        <ExternalLink size={15} aria-hidden="true" /> Открыть
      </Link>
      {error ? <p className="form-error">{error}</p> : null}
    </div>
  );
}
