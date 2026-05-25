"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Item = {
  id: string;
  name: string;
  color?: string;
  description?: string | null;
  systemDefault?: boolean;
};

type OrganizationManagerProps = {
  kind: "category" | "context" | "project";
  title: string;
  items: Item[];
};

const colorOptions = ["#2f6fbb", "#8a5fbf", "#c27a22", "#3f7d46", "#1f6f5f", "#b45309"];

const endpoints = {
  category: "/api/categories",
  context: "/api/contexts",
  project: "/api/projects"
};

export function OrganizationManager({ kind, title, items }: OrganizationManagerProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");

    const form = new FormData(event.currentTarget);
    const response = await fetch(endpoints[kind], {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        color: form.get("color"),
        description: form.get("description")
      })
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Не удалось сохранить.");
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <div className="organization-manager">
      <form className="organization-form" onSubmit={submit}>
        <label className="field">
          <span>Название</span>
          <input name="name" required />
        </label>

        {kind === "category" ? (
          <fieldset className="color-picker">
            <legend>Цвет</legend>
            {colorOptions.map((color) => (
              <label key={color} style={{ "--swatch": color } as React.CSSProperties}>
                <input name="color" type="radio" value={color} defaultChecked={color === colorOptions[0]} />
                <span aria-hidden="true" />
              </label>
            ))}
          </fieldset>
        ) : null}

        {kind === "project" ? (
          <label className="field">
            <span>Описание</span>
            <textarea name="description" rows={3} />
          </label>
        ) : null}

        <button className="primary-button" type="submit" disabled={busy}>
          Сохранить
        </button>
        {error ? <p className="form-error">{error}</p> : null}
      </form>

      <section className="organization-list" aria-label={title}>
        {items.map((item) => (
          <article className="organization-item" key={item.id}>
            {item.color ? (
              <span
                className="organization-item__swatch"
                style={{ background: item.color }}
                aria-hidden="true"
              />
            ) : null}
            <div>
              <h3>{item.name}</h3>
              {item.description ? <p>{item.description}</p> : null}
              {item.systemDefault ? <p>Стандартная</p> : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
