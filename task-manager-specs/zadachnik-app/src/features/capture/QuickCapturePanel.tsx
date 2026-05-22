"use client";

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
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void recordShellEvent("quick_capture.opened");
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await recordShellEvent("quick_capture.submitted_placeholder", title);
    setSaved(true);
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
            <span>Коротко</span>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Например: позвонить по документам"
            />
          </label>
          <button className="primary-button" type="submit">
            Проверить ввод
          </button>
        </form>

        {saved ? (
          <p className="capture-note">Сохранение задач появится в следующей фазе.</p>
        ) : (
          <p className="capture-note">
            Сейчас это вход в быстрый ввод. Реальные задачи появятся после модели задач.
          </p>
        )}
      </section>
    </div>
  );
}
