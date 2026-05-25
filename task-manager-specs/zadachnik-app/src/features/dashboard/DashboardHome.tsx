import { QuickCaptureEntry } from "@/features/capture/QuickCaptureEntry";
import { TaskCard } from "@/features/tasks/TaskCard";
import { prisma } from "@/lib/db";
import { taskInclude } from "@/lib/tasks/task-queries";

export const dynamic = "force-dynamic";

export async function DashboardHome() {
  const [openCount, inboxCount, importantCount, previewTasks] = await Promise.all([
    prisma.task.count({ where: { archivedAt: null, status: { not: "done" } } }),
    prisma.task.count({ where: { archivedAt: null, status: "inbox" } }),
    prisma.task.count({
      where: { archivedAt: null, status: { not: "done" }, importance: "important" }
    }),
    prisma.task.findMany({
      where: { archivedAt: null, status: { not: "done" } },
      include: taskInclude,
      orderBy: { createdAt: "desc" },
      take: 3
    })
  ]);

  return (
    <section className="dashboard-home">
      <div className="dashboard-home__top">
        <div>
          <p className="eyebrow">Сегодня</p>
          <h2>Панель</h2>
        </div>
        <QuickCaptureEntry />
      </div>

      <div className="dashboard-band">
        <h3>Открытые задачи</h3>
        <p>{openCount === 0 ? "Пока нет открытых задач." : `Всего открыто: ${openCount}.`}</p>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-panel">
          <h3>Входящие</h3>
          <p>{inboxCount === 0 ? "Новых задач нет." : `Ждут разбора: ${inboxCount}.`}</p>
        </section>
        <section className="dashboard-panel">
          <h3>Важное</h3>
          <p>{importantCount === 0 ? "Важных открытых задач нет." : `Важных: ${importantCount}.`}</p>
        </section>
      </div>

      <section className="dashboard-preview">
        <h3>Последние задачи</h3>
        {previewTasks.length === 0 ? (
          <div className="empty-state">
            <p>Добавьте первую задачу, и она появится во входящих.</p>
          </div>
        ) : (
          <div className="task-list">
            {previewTasks.map((task) => (
              <TaskCard key={task.id} task={JSON.parse(JSON.stringify(task))} compact />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
