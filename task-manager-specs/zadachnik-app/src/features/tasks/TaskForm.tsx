"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  CategoryOption,
  ContextOption,
  ProjectOption,
  TaskView
} from "@/features/tasks/task-types";
import { toDateInput } from "@/features/tasks/task-formatters";

type TaskFormProps = {
  task: TaskView;
  categories: CategoryOption[];
  contexts: ContextOption[];
  projects: ProjectOption[];
};

export function TaskForm({ task, categories, contexts, projects }: TaskFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const selectedContextIds = new Set(task.contexts.map(({ context }) => context.id));

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setSaved(false);

    const form = new FormData(event.currentTarget);
    const contextIds = form.getAll("contextIds").map(String);
    const body = {
      title: form.get("title"),
      description: form.get("description"),
      status: form.get("status"),
      importance: form.get("importance"),
      isUrgent: form.get("isUrgent") === "on",
      dueDate: form.get("dueDate"),
      doDate: form.get("doDate"),
      estimatedMinutes: form.get("estimatedMinutes"),
      actualMinutes: form.get("actualMinutes"),
      categoryId: form.get("categoryId"),
      projectId: form.get("projectId"),
      personLabel: form.get("personLabel"),
      waitingDirection: form.get("waitingDirection"),
      responseDueDate: form.get("responseDueDate"),
      contextIds
    };

    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body)
    });

    setBusy(false);

    if (!response.ok) {
      const payload = (await response.json().catch(() => ({}))) as { error?: string };
      setError(payload.error ?? "Проверьте поля и попробуйте еще раз.");
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return (
    <form className="task-form" onSubmit={submit}>
      <label className="field field--title">
        <span>Название</span>
        <input name="title" defaultValue={task.title} required />
      </label>

      <div className="task-form__row">
        <label className="field">
          <span>Статус</span>
          <select name="status" defaultValue={task.status}>
            <option value="inbox">Входящие</option>
            <option value="todo">К делу</option>
            <option value="in_progress">В работе</option>
            <option value="waiting">Ожидание</option>
            <option value="done">Выполнено</option>
          </select>
        </label>
        <label className="field">
          <span>Важность</span>
          <select name="importance" defaultValue={task.importance}>
            <option value="normal">Обычная</option>
            <option value="important">Важная</option>
          </select>
        </label>
      </div>

      <label className="task-toggle">
        <input name="isUrgent" type="checkbox" defaultChecked={task.isUrgent} />
        <span>Срочно</span>
      </label>

      <section className="task-form__group">
        <h3>Даты</h3>
        <div className="task-form__row">
          <label className="field">
            <span>День выполнения</span>
            <input name="doDate" type="date" defaultValue={toDateInput(task.doDate)} />
          </label>
          <label className="field">
            <span>Крайний срок</span>
            <input name="dueDate" type="date" defaultValue={toDateInput(task.dueDate)} />
          </label>
        </div>
      </section>

      <section className="task-form__group">
        <h3>Время</h3>
        <div className="task-form__row">
          <label className="field">
            <span>План, мин</span>
            <input
              name="estimatedMinutes"
              type="number"
              min="0"
              defaultValue={task.estimatedMinutes ?? ""}
            />
          </label>
          <label className="field">
            <span>Факт, мин</span>
            <input
              name="actualMinutes"
              type="number"
              min="0"
              defaultValue={task.actualMinutes ?? ""}
            />
          </label>
        </div>
      </section>

      <section className="task-form__group">
        <h3>Организация</h3>
        <div className="task-form__row">
          <label className="field">
            <span>Категория</span>
            <select name="categoryId" defaultValue={task.category?.id ?? ""}>
              <option value="">Без категории</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Проект</span>
            <select name="projectId" defaultValue={task.project?.id ?? ""}>
              <option value="">Без проекта</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <fieldset className="context-picker">
          <legend>Контексты</legend>
          {contexts.map((context) => (
            <label key={context.id}>
              <input
                name="contextIds"
                type="checkbox"
                value={context.id}
                defaultChecked={selectedContextIds.has(context.id)}
              />
              <span>{context.name}</span>
            </label>
          ))}
        </fieldset>

        <label className="field">
          <span>Человек</span>
          <input name="personLabel" defaultValue={task.personLabel ?? ""} />
        </label>

        <div className="task-form__row">
          <label className="field">
            <span>Ожидание</span>
            <select name="waitingDirection" defaultValue={task.waitingDirection ?? ""}>
              <option value="">Без ожидания</option>
              <option value="waiting_for_me">ждут от меня</option>
              <option value="waiting_for_them">я жду</option>
            </select>
          </label>
          <label className="field">
            <span>Ответить до</span>
            <input
              name="responseDueDate"
              type="date"
              defaultValue={toDateInput(task.responseDueDate)}
            />
          </label>
        </div>
      </section>

      <label className="field">
        <span>Описание</span>
        <textarea name="description" defaultValue={task.description ?? ""} rows={5} />
      </label>

      <div className="task-form__actions">
        <button className="primary-button" type="submit" disabled={busy}>
          Сохранить задачу
        </button>
        {saved ? <span className="task-form__saved">Сохранено</span> : null}
      </div>

      {error ? <p className="form-error">{error}</p> : null}
    </form>
  );
}
