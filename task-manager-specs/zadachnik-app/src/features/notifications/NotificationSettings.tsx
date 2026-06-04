"use client";

import { Bell, BellOff } from "lucide-react";
import { useEffect, useState } from "react";

type PreferencesPayload = {
  preferences: {
    morningReview: { enabled: boolean; time: string | null };
    taskReminders: { enabled: boolean; time: string | null };
  };
  push: {
    supported: boolean;
    publicKey: string | null;
    subscriptionCount: number;
  };
};

function urlBase64ToUint8Array(value: string) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}

export function NotificationSettings() {
  const [payload, setPayload] = useState<PreferencesPayload | null>(null);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const response = await fetch("/api/notifications/preferences");
    const data = (await response.json()) as PreferencesPayload;
    setPayload(data);
  }

  useEffect(() => {
    load();
  }, []);

  async function save(next: PreferencesPayload["preferences"]) {
    setBusy(true);
    setStatus("");
    const response = await fetch("/api/notifications/preferences", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(next)
    });
    setBusy(false);

    if (!response.ok) {
      setStatus("Не удалось сохранить настройки.");
      return;
    }

    await load();
    setStatus("Настройки сохранены.");
  }

  async function enablePush() {
    if (!payload?.push.publicKey || !("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("На этом устройстве push пока недоступен. На iPhone открой установленное PWA с экрана Домой.");
      return;
    }

    setBusy(true);
    setStatus("");
    const registration = await navigator.serviceWorker.register("/sw.js");
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      setBusy(false);
      setStatus("Разрешение на уведомления не выдано.");
      return;
    }

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(payload.push.publicKey)
    });

    await fetch("/api/notifications/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...subscription.toJSON(), label: navigator.userAgent.slice(0, 80) })
    });

    setBusy(false);
    await load();
    setStatus("Уведомления подключены.");
  }

  if (!payload) {
    return <p className="muted">Загружаю настройки...</p>;
  }

  const nextMorning = (enabled: boolean) => ({
    morningReview: {
      enabled,
      time: payload.preferences.morningReview.time ?? "09:00"
    },
    taskReminders: payload.preferences.taskReminders
  });

  const nextTaskReminders = (enabled: boolean) => ({
    morningReview: payload.preferences.morningReview,
    taskReminders: { enabled, time: null }
  });

  return (
    <section className="notification-settings">
      <div className="notification-settings__top">
        {payload.push.subscriptionCount > 0 ? <Bell size={22} aria-hidden="true" /> : <BellOff size={22} aria-hidden="true" />}
        <div>
          <h3>Push-уведомления</h3>
          <p>Утренний обзор и напоминания по задачам включаются отдельно.</p>
        </div>
      </div>

      <button className="primary-button" type="button" onClick={enablePush} disabled={busy || !payload.push.supported}>
        Подключить это устройство
      </button>
      {!payload.push.supported ? (
        <p className="form-error">Нужно добавить VAPID-ключи на сервер, после этого появится реальная подписка.</p>
      ) : null}

      <div className="notification-settings__item">
        <div>
          <strong>Утренний обзор</strong>
          <span>Пора открыть задачи</span>
        </div>
        <label className="task-toggle">
          <input
            type="checkbox"
            checked={payload.preferences.morningReview.enabled}
            onChange={(event) => save(nextMorning(event.target.checked))}
            disabled={busy}
          />
          <span>Включено</span>
        </label>
        <label className="field">
          <span>Время</span>
          <input
            type="time"
            value={payload.preferences.morningReview.time ?? "09:00"}
            onChange={(event) =>
              save({
                morningReview: {
                  enabled: payload.preferences.morningReview.enabled,
                  time: event.target.value
                },
                taskReminders: payload.preferences.taskReminders
              })
            }
          />
        </label>
      </div>

      <div className="notification-settings__item">
        <div>
          <strong>Напоминания задач</strong>
          <span>Короткий сигнал в выбранное время</span>
        </div>
        <label className="task-toggle">
          <input
            type="checkbox"
            checked={payload.preferences.taskReminders.enabled}
            onChange={(event) => save(nextTaskReminders(event.target.checked))}
            disabled={busy}
          />
          <span>Включено</span>
        </label>
      </div>

      {status ? <p className="notification-settings__status">{status}</p> : null}
    </section>
  );
}
