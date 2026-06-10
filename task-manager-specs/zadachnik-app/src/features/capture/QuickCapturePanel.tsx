"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createTask as createOfflineAwareTask } from "@/features/offline/task-client";
import type { AssistantCaptureInterpretation } from "@/lib/assistant-capture/interpret-task-capture";

type QuickCapturePanelProps = {
  onClose: () => void;
};

type CaptureMode = "manual" | "assistant";

type CategoryOption = {
  id: string;
  name: string;
};

type AssistantDraft = AssistantCaptureInterpretation["draft"];

async function recordShellEvent(kind: string, title?: string) {
  await fetch("/api/shell-events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ kind, title })
  });
}

function todayOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function displayDate(value: string | null) {
  if (!value) {
    return "не задано";
  }

  return new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00.000Z`));
}

function importanceLabel(value: AssistantDraft["importance"]) {
  return value === "important" ? "важная" : "обычная";
}

export function QuickCapturePanel({ onClose }: QuickCapturePanelProps) {
  const router = useRouter();
  const [mode, setMode] = useState<CaptureMode>("manual");
  const [title, setTitle] = useState("");
  const [assistantPhrase, setAssistantPhrase] = useState("");
  const [interpretation, setInterpretation] = useState<AssistantCaptureInterpretation | null>(null);
  const [draft, setDraft] = useState<AssistantDraft | null>(null);
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);
  const [editingDraft, setEditingDraft] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void recordShellEvent("quick_capture.opened");
  }, []);

  async function createTask(body: Record<string, unknown>) {
    return createOfflineAwareTask(body);
  }

  async function submitManual(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await createTask({ title });
      setTitle("");
      setMessage(
        result.queued
          ? "Задача сохранена на телефоне. Ждет синхронизации."
          : "Задача добавлена во входящие."
      );
      if (!result.queued) {
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить.");
    } finally {
      setBusy(false);
    }
  }

  async function submitAssistant(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/assistant-capture/interpret", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ phrase: assistantPhrase })
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Не удалось разобрать задачу.");
      }

      const payload = (await response.json()) as {
        interpretation: AssistantCaptureInterpretation;
        categoryOptions: CategoryOption[];
      };

      setInterpretation(payload.interpretation);
      setDraft(payload.interpretation.draft);
      setCategoryOptions(payload.categoryOptions);
      setEditingDraft(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось разобрать задачу.");
    } finally {
      setBusy(false);
    }
  }

  async function saveAssistantDraft() {
    if (!draft) {
      return;
    }

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const result = await createTask({
        title: draft.title,
        doDate: draft.doDate,
        dueDate: draft.dueDate,
        categoryId: draft.categoryId,
        importance: draft.importance
      });
      setAssistantPhrase("");
      setInterpretation(null);
      setDraft(null);
      setEditingDraft(false);
      setMessage(
        result.queued
          ? "Задача сохранена на телефоне. Ждет синхронизации."
          : "Задача сохранена после подтверждения."
      );
      if (!result.queued) {
        router.refresh();
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось сохранить.");
    } finally {
      setBusy(false);
    }
  }

  function cancelAssistantDraft() {
    setInterpretation(null);
    setDraft(null);
    setEditingDraft(false);
    setMessage("Черновик отменен. Задача не создана.");
  }

  function updateDraft(patch: Partial<AssistantDraft>) {
    setDraft((current) => (current ? { ...current, ...patch } : current));
  }

  function applyQuestion(questionId: string, value: string) {
    if (!draft) {
      return;
    }

    if (questionId === "date") {
      if (value === "Сегодня") {
        updateDraft({ doDate: todayOffset(0), dueDate: null });
      } else if (value === "Завтра") {
        updateDraft({ doDate: todayOffset(1), dueDate: null });
      }
    }

    if (questionId === "category") {
      const category = categoryOptions.find((item) => item.name === value);
      updateDraft({
        categoryId: category?.id ?? null,
        categoryName: category?.name ?? null
      });
    }

    if (questionId === "importance") {
      updateDraft({ importance: value === "Да" ? "important" : "normal" });
    }
  }

  const canShowDraft = interpretation && draft;

  return (
    <div className="capture-backdrop" role="presentation">
      <section className="capture-panel" role="dialog" aria-modal="true" aria-labelledby="capture-title">
        <div className="capture-panel__header">
          <h3 id="capture-title">Новая задача</h3>
          <button className="secondary-button" onClick={onClose}>
            Закрыть
          </button>
        </div>

        <div className="capture-mode-tabs" role="tablist" aria-label="Способ добавления">
          <button
            className={mode === "manual" ? "capture-mode-tabs__button is-active" : "capture-mode-tabs__button"}
            type="button"
            onClick={() => setMode("manual")}
          >
            Быстро
          </button>
          <button
            className={mode === "assistant" ? "capture-mode-tabs__button is-active" : "capture-mode-tabs__button"}
            type="button"
            onClick={() => setMode("assistant")}
          >
            С ассистентом
          </button>
        </div>

        {mode === "manual" ? (
          <form className="capture-form" onSubmit={submitManual}>
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
        ) : (
          <div className="capture-assistant">
            <form className="capture-form" onSubmit={submitAssistant}>
              <label>
                <span>Опишите задачу</span>
                <input
                  value={assistantPhrase}
                  onChange={(event) => setAssistantPhrase(event.target.value)}
                  placeholder="Например: завтра важное рабочее письмо"
                />
              </label>
              <button className="primary-button" type="submit" disabled={busy}>
                Разобрать
              </button>
            </form>

            {canShowDraft ? (
              <section className="capture-assistant__card" aria-label="Понимание ассистента">
                <div className="capture-assistant__card-header">
                  <div>
                    <span className="capture-assistant__eyebrow">Еще не сохранено</span>
                    <h4>Ассистент понял так</h4>
                  </div>
                </div>

                {interpretation.questions.length > 0 ? (
                  <div className="capture-assistant__questions">
                    {interpretation.questions.map((question) => (
                      <div key={question.id} className="capture-assistant__question">
                        <p>{question.question}</p>
                        <div className="capture-assistant__chips">
                          {question.options?.map((option) => (
                            <button
                              key={option}
                              type="button"
                              className="secondary-button"
                              onClick={() => applyQuestion(question.id, option)}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}

                {editingDraft ? (
                  <div className="capture-assistant__edit">
                    <label className="field">
                      <span>Название</span>
                      <input
                        value={draft.title}
                        onChange={(event) => updateDraft({ title: event.target.value })}
                      />
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
                      <dd>{displayDate(draft.doDate ?? draft.dueDate)}</dd>
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
                  Можно сохранить так: неизвестные поля останутся пустыми.
                </p>

                <div className="capture-assistant__actions">
                  <button className="primary-button" type="button" onClick={saveAssistantDraft} disabled={busy}>
                    Сохранить
                  </button>
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => setEditingDraft((value) => !value)}
                  >
                    {editingDraft ? "Готово" : "Изменить"}
                  </button>
                  <button className="secondary-button" type="button" onClick={cancelAssistantDraft}>
                    Отмена
                  </button>
                </div>
              </section>
            ) : null}
          </div>
        )}

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
