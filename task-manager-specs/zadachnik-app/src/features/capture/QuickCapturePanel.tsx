"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type QuickCapturePanelProps = {
  onClose: () => void;
};

async function recordShellEvent(kind: string, title?: string) {
  await fetch("/api/shell-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, title })
  });
}

export function QuickCapturePanel({ onClose }: QuickCapturePanelProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void recordShellEvent("quick_capture.opened");
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title })
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Проверьте поля и попробуйте еще раз.");
      return;
    }

    setTitle("");
    setMessage("Задача добавлена во входящие.");
    router.refresh();
  }

  return (
    <div className="capture-backdrop" role="presentation">
      <section className="capture-panel" role="dialog" aria-modal="true" aria-labelledby="capture-title">
        <div className="capture-panel__header">
          <h3 id="capture-title">Новая задача</h3>
          <button className="secondary-button" onClick={onClose}>
            Закрыть
          </button>
        </div>

        <form className="capture-form" onSubmit={submit}>
          <label>
            <span>Новая задача</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Что нужно не забыть?"
            />
          </label>
          <button className="primary-button" type="submit" disabled={busy}>
            Добавить
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}

        {message ? (
          <p className="capture-note">{message}</p>
        ) : (
          <p className="capture-note">
            Добавьте короткую формулировку. Детали можно заполнить позже.
          </p>
        )}
      </section>
    </div>
  );
}
