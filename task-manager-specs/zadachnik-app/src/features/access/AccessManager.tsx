"use client";

import { useState } from "react";

export function AccessManager() {
  const [privateUrl, setPrivateUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");

  async function regenerate() {
    setStatus("loading");
    const response = await fetch("/api/access/regenerate", { method: "POST" });

    if (!response.ok) {
      setStatus("error");
      return;
    }

    const payload = (await response.json()) as { privateUrl: string };
    setPrivateUrl(payload.privateUrl);
    setStatus("ready");
  }

  return (
    <div className="access-panel">
      <p className="muted">
        Перегенерация отключит старую ссылку и создаст новую приватную ссылку.
      </p>
      <button className="primary-button" onClick={regenerate} disabled={status === "loading"}>
        {status === "loading" ? "Создаем..." : "Перегенерировать ссылку"}
      </button>
      {status === "ready" ? (
        <label className="url-field">
          <span>Новая ссылка</span>
          <input readOnly value={privateUrl} onFocus={(event) => event.currentTarget.select()} />
        </label>
      ) : null}
      {status === "error" ? (
        <p className="form-error">Не удалось создать новую ссылку.</p>
      ) : null}
    </div>
  );
}
