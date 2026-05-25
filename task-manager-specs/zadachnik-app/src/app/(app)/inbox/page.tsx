import { TaskList } from "@/features/tasks/TaskList";
import { prisma } from "@/lib/db";
import { taskInclude } from "@/lib/tasks/task-queries";

export const dynamic = "force-dynamic";

export default async function InboxPage() {
  const tasks = await prisma.task.findMany({
    where: {
      archivedAt: null,
      status: { not: "done" }
    },
    include: taskInclude,
    orderBy: [{ status: "asc" }, { createdAt: "desc" }]
  });

  return (
    <section className="page-section">
      <p className="eyebrow">Сбор</p>
      <h2>Входящие</h2>
      <TaskList tasks={JSON.parse(JSON.stringify(tasks))} />
    </section>
  );
}
