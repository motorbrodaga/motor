"use client";

import { ClipboardList, Mail, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AssistantCaptureInterpretation } from "@/lib/assistant-capture/interpret-task-capture";
import type { IntakeChoice, IntakeProvider } from "@/lib/intake/intake-types";

type CategoryOption = {
  id: string;
  name: string;
};

type Draft = AssistantCaptureInterpretation["draft"];
type Mode = "telegram" | "gmail" | "paste";

type PreparedInterpretation = AssistantCaptureInterpretation & {
  sourceLabel: string;
  sourcePreview: string;
};

function formatDate(value: string | null) {
  if (!value) {
    return "без даты";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(value));
}

function displayDraftDate(draft: Draft) {
  return formatDate(draft.doDate ?? draft.dueDate);
}

function importanceLabel(value: Draft["importance"]) {
  return value === "important" ? "важная" : "обычная";
}

function sourceName(provider: IntakeProvider) {
  if (provider === "telegram") {
    return "Telegram";
  }

  if (provider === "gmail") {
    return "Gmail";
  }

  return "Текст";
}

export function IntakePageClient() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("telegram");
  const [choices, setChoices] = useState<IntakeChoice[]>([]);
  const [gmailQuery, setGmailQuery] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [interpretation, setInterpretation] = useState<PreparedInterpretation | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingDraft, setEditingDraft] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function readJson<T>(response: Response) {
    const payload = (await response.json().catch(() => ({}))) as T & { error?: string };

    if (!response.ok) {
      throw new Error(payload.error ?? "Не удалось выполнить действие.");
    }

    return payload;
  }

  async function loadTelegram() {
    setBusy(true);
    setError("");
    setMessage("");
    setChoices([]);
    setInterpretation(null);
    setDraft(null);

    try {
      const response = await fetch("/api/intake/telegram", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "latest", limit: 20 })
      });
      const payload = await readJson<{ choices: IntakeChoice[]; unavailable?: string }>(response);
      setChoices(payload.choices);
      setMessage(payload.unavailable ?? (payload.choices.length ? "" : "Пока нет доступных сообщений."));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось открыть Telegram.");
    } finally {
      setBusy(false);
    }
  }

  async function searchGmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    setChoices([]);
    setInterpretation(null);
    setDraft(null);

    try {
      const response = await fetch("/api/intake/gmail", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "search", query: gmailQuery, limit: 20 })
      });
      const payload = await readJson<{ choices: IntakeChoice[]; unavailable?: string }>(response);
      setChoices(payload.choices);
      setMessage(payload.unavailable ?? (payload.choices.length ? "" : "Ничего не найдено."));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось выполнить поиск Gmail.");
    } finally {
      setBusy(false);
    }
  }

  async function prepareChoice(choice: IntakeChoice) {
    await prepareSource(choice.sourceText, choice.sourceLabel);
  }

  async function prepareManualPaste(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await prepareSource(pasteText, "from Telegram Motorcodex_bot");
  }

  async function prepareSource(sourceText: string, sourceLabel: string) {
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/intake/prepare", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sourceText, sourceLabel })
      });
      const payload = await readJson<{
        interpretation: PreparedInterpretation;
        categoryOptions: CategoryOption[];
      }>(response);
      setInterpretation(payload.interpretation);
      setDraft(payload.interpretation.draft);
      setCategoryOptions(payload.categoryOptions);
      setEditingDraft(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось подготовить задачу.");
    } finally {
      setBusy(false);
    }
  }

  async function saveDraft() {
    if (!draft || !interpretation) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          title: draft.title,
          doDate: draft.doDate,
          dueDate: draft.dueDate,
          categoryId: draft.categoryId,
          importance: draft.importance,
          sourceLabel: interpretation.sourceLabel
        })
      });
      await readJson(response);
      setInterpretation(null);
      setDraft(null);
      setEditingDraft(false);
      setMessage("Задача создана после подтверждения.");
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Не удалось сохранить задачу.");
    } finally {
      setBusy(false);
    }
  }

  function cancelDraft() {
    setInterpretation(null);
    setDraft(null);
    setEditingDraft(false);
    setMessage("Черновик отменен. Задача не создана.");
  }

  function updateDraft(patch: Partial<Draft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  const canShowDraft = interpretation && draft;

  return (
    <>
      <section className="intake-intro">
        <ClipboardList size={22} aria-hidden="true" />
        <div>
          <h3>Только по вашему действию</h3>
          <p>
            Здесь ничего не сканируется само. Вы выбираете сообщение или письмо, затем проверяете
            карточку задачи перед сохранением.
          </p>
        </div>
      </section>

      <div className="intake-tabs" role="tablist" aria-label="Источник импорта">
        <button
          type="button"
          className={mode === "telegram" ? "intake-tabs__button is-active" : "intake-tabs__button"}
          onClick={() => {
            setMode("telegram");
            setChoices([]);
            setMessage("");
          }}
        >
          <MessageCircle size={17} aria-hidden="true" />
          Telegram
        </button>
        <button
          type="button"
          className={mode === "gmail" ? "intake-tabs__button is-active" : "intake-tabs__button"}
          onClick={() => {
            setMode("gmail");
            setChoices([]);
            setMessage("");
          }}
        >
          <Mail size={17} aria-hidden="true" />
          Gmail
        </button>
        <button
          type="button"
          className={mode === "paste" ? "intake-tabs__button is-active" : "intake-tabs__button"}
          onClick={() => {
            setMode("paste");
            setChoices([]);
            setMessage("");
          }}
        >
          <ClipboardList size={17} aria-hidden="true" />
          Вставка
        </button>
      </div>

      {mode === "telegram" ? (
        <section className="intake-panel">
          <div className="intake-panel__header">
            <div>
              <h3>Telegram Motorcodex_bot</h3>
              <p>Показываются только последние 20 импортированных сообщений.</p>
            </div>
            <button className="primary-button" type="button" onClick={loadTelegram} disabled={busy}>
              Показать 20
            </button>
          </div>
        </section>
      ) : null}

      {mode === "gmail" ? (
        <section className="intake-panel">
          <form className="intake-search" onSubmit={searchGmail}>
            <label className="field">
              <span>Поиск Gmail</span>
              <input
                value={gmailQuery}
                onChange={(event) => setGmailQuery(event.target.value)}
                placeholder="например: счет, договор, письмо от клиента"
              />
            </label>
            <button className="primary-button" type="submit" disabled={busy}>
              Найти письма
            </button>
          </form>
        </section>
      ) : null}

      {mode === "paste" ? (
        <section className="intake-panel">
          <form className="intake-search" onSubmit={prepareManualPaste}>
            <label className="field">
              <span>Текст из Telegram</span>
              <textarea
                value={pasteText}
                onChange={(event) => setPasteText(event.target.value)}
                rows={5}
                placeholder="Вставьте сюда сообщение, из которого нужно сделать задачу"
              />
            </label>
            <button className="primary-button" type="submit" disabled={busy}>
              Подготовить карточку
            </button>
          </form>
        </section>
      ) : null}

      {choices.length > 0 ? (
        <section className="intake-results" aria-label="Варианты для импорта">
          {choices.map((choice) => (
            <button
              key={`${choice.provider}-${choice.id}`}
              type="button"
              className="intake-choice"
              onClick={() => prepareChoice(choice)}
              disabled={busy}
            >
              <span>{sourceName(choice.provider)}</span>
              <strong>{choice.title}</strong>
              <small>{choice.occurredAt ? formatDate(choice.occurredAt) : choice.sourceLabel}</small>
            </button>
          ))}
        </section>
      ) : null}

      {canShowDraft ? (
        <section className="capture-assistant__card intake-draft" aria-label="Карточка задачи перед сохранением">
          <div className="capture-assistant__card-header">
            <div>
              <span className="capture-assistant__eyebrow">Еще не сохранено</span>
              <h3>Карточка задачи</h3>
            </div>
          </div>

          <p className="intake-draft__source">
            Источник: <strong>{interpretation.sourceLabel}</strong>
          </p>

          {editingDraft ? (
            <div className="capture-assistant__edit">
              <label className="field">
                <span>Название</span>
                <input value={draft.title} onChange={(event) => updateDraft({ title: event.target.value })} />
              </label>
              <label className="field">
                <span>День выполнения</span>
                <input
                  type="date"
                  value={draft.doDate ?? ""}
                  onChange={(event) => updateDraft({ doDate: event.target.value || null })}
                />
              </label>
              <label className="field">
                <span>Категория</span>
                <select
                  value={draft.categoryId ?? ""}
                  onChange={(event) => {
                    const category = categoryOptions.find((item) => item.id === event.target.value);
                    updateDraft({
                      categoryId: category?.id ?? null,
                      categoryName: category?.name ?? null
                    });
                  }}
                >
                  <option value="">Без категории</option>
                  {categoryOptions.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                <span>Важность</span>
                <select
                  value={draft.importance}
                  onChange={(event) =>
                    updateDraft({ importance: event.target.value === "important" ? "important" : "normal" })
                  }
                >
                  <option value="normal">Обычная</option>
                  <option value="important">Важная</option>
                </select>
              </label>
            </div>
          ) : (
            <dl className="capture-assistant__fields">
              <div>
                <dt>Название</dt>
                <dd>{draft.title}</dd>
              </div>
              <div>
                <dt>Дата</dt>
                <dd>{displayDraftDate(draft)}</dd>
              </div>
              <div>
                <dt>Категория</dt>
                <dd>{draft.categoryName ?? "не задано"}</dd>
              </div>
              <div>
                <dt>Важность</dt>
                <dd>{importanceLabel(draft.importance)}</dd>
              </div>
            </dl>
          )}

          <p className="capture-assistant__hint">
            Исходный текст не сохраняется автоматически. В задаче останется только карточка и метка источника.
          </p>

          <div className="capture-assistant__actions">
            <button className="primary-button" type="button" onClick={saveDraft} disabled={busy}>
              Сохранить
            </button>
            <button className="secondary-button" type="button" onClick={() => setEditingDraft((value) => !value)}>
              {editingDraft ? "Готово" : "Изменить"}
            </button>
            <button className="secondary-button" type="button" onClick={cancelDraft}>
              Отмена
            </button>
          </div>
        </section>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}
      {message ? <p className="capture-note">{message}</p> : null}
    </>
  );
}
