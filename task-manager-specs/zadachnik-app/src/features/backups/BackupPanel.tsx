"use client";

import { useState } from "react";

type BackupRun = {
  id: string;
  status: string;
  fileName: string | null;
  completedAt: string | null;
  entityCountsJson: string | null;
  error: string | null;
};

type BackupPanelProps = {
  latest: BackupRun | null;
};

function formatDate(value: string | null) {
  if (!value) {
    return "еще не запускался";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function BackupPanel({ latest }: BackupPanelProps) {
  const [backup, setBackup] = useState(latest);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function runBackup() {
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/backups/run", { method: "POST" });
      const payload = (await response.json().catch(() => ({}))) as { backup?: BackupRun };

      if (!response.ok || !payload.backup) {
        throw new Error("Не удалось создать бэкап.");
      }

      setBackup(payload.backup);
      setMessage("Бэкап создан.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Не удалось создать бэкап.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="backup-panel">
      <div>
        <p className="eyebrow">Надежность</p>
        <h2>Бэкапы</h2>
      </div>

      <div className="backup-card">
        <h3>Последний бэкап</h3>
        <dl>
          <div>
            <dt>Статус</dt>
            <dd>{backup?.status === "success" ? "успешно" : backup?.status ?? "не запускался"}</dd>
          </div>
          <div>
            <dt>Когда</dt>
            <dd>{formatDate(backup?.completedAt ?? null)}</dd>
          </div>
          <div>
            <dt>Файл</dt>
            <dd>{backup?.fileName ?? "пока нет"}</dd>
          </div>
        </dl>
        {backup?.error ? <p className="form-error">{backup.error}</p> : null}
      </div>

      <button className="primary-button" type="button" onClick={runBackup} disabled={busy}>
        Создать бэкап сейчас
      </button>

      {message ? <p className="backup-panel__status">{message}</p> : null}

      <p className="muted">
        В бэкап попадают задачи, заметки, категории, контексты, проекты, календарные связи и настройки.
        Секреты, Telegram-сессии и приватные файлы не сохраняются.
      </p>
    </section>
  );
}
