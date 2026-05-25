"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDate } from "@/features/tasks/task-formatters";

type Note = {
  id: string;
  body: string;
  createdAt: string;
};

type TaskNotesFeedProps = {
  taskId: string;
  notes: Note[];
};

export function TaskNotesFeed({ taskId, notes }: TaskNotesFeedProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch(`/api/tasks/${taskId}/notes`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ body: form.get("body") })
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Не удалось добавить заметку.");
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <section className="notes-feed">
      <h3>Заметки</h3>
      <form className="notes-form" onSubmit={submit}>
        <label className="field">
          <span>Новая заметка</span>
          <textarea name="body" rows={3} />
        </label>
        <button className="primary-button" type="submit" disabled={busy}>
          Добавить заметку
        </button>
        {error ? <p className="form-error">{error}</p> : null}
      </form>

      {notes.length === 0 ? (
        <div className="empty-state">
          <h3>Заметок пока нет</h3>
          <p>Добавляйте сюда уточнения, решения и ход работы.</p>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map((note) => (
            <article className="note-item" key={note.id}>
              <time dateTime={note.createdAt}>{formatDate(note.createdAt)}</time>
              <p>{note.body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
