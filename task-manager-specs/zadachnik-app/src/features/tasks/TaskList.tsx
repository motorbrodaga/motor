"use client";

import { useEffect, useMemo, useState } from "react";
import { getCachedTasks, saveCachedTasks } from "@/features/offline/offline-store";
import type { TaskView } from "@/features/tasks/task-types";
import { TaskCard } from "@/features/tasks/TaskCard";

type TaskListProps = {
  tasks: TaskView[];
  emptyTitle?: string;
  emptyBody?: string;
};

export function TaskList({
  tasks,
  emptyTitle = "Входящие пусты",
  emptyBody = "Добавьте задачу короткой фразой, детали можно заполнить позже."
}: TaskListProps) {
  const [cachedTasks, setCachedTasks] = useState<TaskView[]>(tasks);

  useEffect(() => {
    setCachedTasks(tasks);
    void saveCachedTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    const loadCached = () => {
      void getCachedTasks().then((items) => {
        if (items.length > 0) {
          setCachedTasks(items.filter((task) => !task.archivedAt && task.status !== "done"));
        }
      });
    };

    loadCached();
    window.addEventListener("zadachnik-offline-change", loadCached);

    return () => window.removeEventListener("zadachnik-offline-change", loadCached);
  }, []);

  const visibleTasks = useMemo(() => {
    return cachedTasks.filter((task) => !task.archivedAt && task.status !== "done");
  }, [cachedTasks]);

  if (visibleTasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {visibleTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
