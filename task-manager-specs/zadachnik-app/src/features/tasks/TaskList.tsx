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
  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyBody}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
