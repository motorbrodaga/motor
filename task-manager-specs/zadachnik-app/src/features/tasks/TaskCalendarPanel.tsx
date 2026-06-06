"use client";

import { CalendarClock, Copy, RefreshCw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { TaskView } from "@/features/tasks/task-types";
import { formatDate, toDateInput, toDateTimeInput } from "@/features/tasks/task-formatters";

type TaskCalendarPanelProps = {
  task: TaskView;
};

function addOneHour(value: string) {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  date.setHours(date.getHours() + 1);
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

export function TaskCalendarPanel({ task }: TaskCalendarPanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState(task.calendarLink?.allDay === false ? "timed" : "all-day");
  const defaultDate = toDateInput(task.calendarLink?.startsAt ?? task.doDate ?? task.dueDate);
  const defaultStart = toDateTimeInput(task.calendarLink?.startsAt ?? task.doDate ?? task.dueDate);
  const [date, setDate] = useState(defaultDate);
  const [startsAt, setStartsAt] = useState(defaultStart);
  const [endsAt, setEndsAt] = useState(toDateTimeInput(task.calendarLink?.endsAt) || addOneHour(defaultStart));
  const [includeDescription, setIncludeDescription] = useState(task.calendarLink?.includeDescription ?? true);
  const [includeNotes, setIncludeNotes] = useState(task.calendarLink?.includeNotes ?? false);
  const [feedUrl, setFeedUrl] = useState("");
  const [status, setStatus] = useState("");
  const [showManualCopy, setShowManualCopy] = useState(false);
  const [busy, setBusy] = useState(false);

  const hasLink = Boolean(task.calendarLink);
  const startsAtValue = useMemo(() => {
    if (mode === "all-day") {
      return date ? `${date}T00:00:00.000Z` : "";
    }

    return startsAt;
  }, [date, mode, startsAt]);

  useEffect(() => {
    fetch("/api/calendar/feed-token")
      .then((response) => response.json())
      .then((payload: { url?: string }) => setFeedUrl(payload.url ?? ""))
      .catch(() => setFeedUrl(""));
  }, []);

  useEffect(() => {
    if (mode === "timed" && startsAt && !endsAt) {
      setEndsAt(addOneHour(startsAt));
    }
  }, [endsAt, mode, startsAt]);

  async function saveCalendarLink() {
    setBusy(true);
    setStatus("");

    const response = await fetch(`/api/tasks/${task.id}/calendar`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        mode,
        startsAt: startsAtValue,
        endsAt: mode === "timed" ? endsAt : undefined,
        includeDescription,
        includeNotes
      })
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setStatus(payload.error ?? "Не удалось обновить календарь.");
      return;
    }

    const payload = (await response.json()) as { feedUrl?: string };
    if (payload.feedUrl) {
      setFeedUrl(payload.feedUrl);
    }
    setStatus("Календарь обновлен.");
    router.refresh();
  }

  async function copyFeedUrl() {
    if (!navigator.clipboard?.writeText) {
      setShowManualCopy(true);
      setStatus("Не удалось скопировать автоматически. Ссылка ниже, ее можно выделить вручную.");
      return;
    }

    try {
      await navigator.clipboard.writeText(feedUrl);
      setShowManualCopy(false);
      setStatus("Ссылка скопирована.");
    } catch {
      setShowManualCopy(true);
      setStatus("Не удалось скопировать автоматически. Ссылка ниже, ее можно выделить вручную.");
    }
  }

  async function regenerateFeed() {
    setBusy(true);
    const response = await fetch("/api/calendar/feed-token", { method: "POST" });
    setBusy(false);
    const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      setStatus(payload.error ?? "Не удалось обновить ссылку.");
      return;
    }

    setFeedUrl(payload.url);
    setStatus("Старая ссылка отключена. Новую можно подписать на iPhone.");
  }

  return (
    <section className="calendar-panel">
      <div className="calendar-panel__header">
        <CalendarClock size={22} aria-hidden="true" />
        <div>
          <h3>Календарь iPhone</h3>
          <p>Добавь задачу в подписку календаря. Изменения в задаче попадут в feed.</p>
        </div>
      </div>

      <div className="segmented-control" aria-label="Тип события">
        <button type="button" className={mode === "all-day" ? "is-active" : ""} onClick={() => setMode("all-day")}>
          Весь день
        </button>
        <button type="button" className={mode === "timed" ? "is-active" : ""} onClick={() => setMode("timed")}>
          Точное время
        </button>
      </div>

      {mode === "all-day" ? (
        <label className="field">
          <span>Дата</span>
          <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
      ) : (
        <div className="task-form__row">
          <label className="field">
            <span>Начало</span>
            <input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} />
          </label>
          <label className="field">
            <span>Окончание</span>
            <input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} />
          </label>
        </div>
      )}

      <div className="calendar-panel__toggles">
        <label className="task-toggle">
          <input type="checkbox" checked={includeDescription} onChange={(event) => setIncludeDescription(event.target.checked)} />
          <span>Включить описание</span>
        </label>
        <label className="task-toggle">
          <input type="checkbox" checked={includeNotes} onChange={(event) => setIncludeNotes(event.target.checked)} />
          <span>Включить заметки</span>
        </label>
      </div>

      <div className="calendar-panel__actions">
        <button className="primary-button" type="button" onClick={saveCalendarLink} disabled={busy}>
          {hasLink ? "Обновить событие" : "Добавить в календарь"}
        </button>
        <button className="secondary-button" type="button" onClick={copyFeedUrl} disabled={!feedUrl}>
          <Copy size={16} aria-hidden="true" />
          Скопировать подписку
        </button>
        <button className="secondary-button" type="button" onClick={regenerateFeed} disabled={busy}>
          <RefreshCw size={16} aria-hidden="true" />
          Новая ссылка
        </button>
      </div>

      {showManualCopy ? (
        <label className="field calendar-panel__manual-copy">
          <span>Ссылка подписки</span>
          <input readOnly value={feedUrl} onFocus={(event) => event.currentTarget.select()} />
        </label>
      ) : null}

      {hasLink ? (
        <p className="calendar-panel__meta">
          Последнее обновление: {formatDate(task.calendarLink?.lastSyncedAt)}. iPhone сам выбирает момент обновления подписки.
        </p>
      ) : null}
      {status ? <p className="calendar-panel__status">{status}</p> : null}
    </section>
  );
}
