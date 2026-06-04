import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskCalendarPanel } from "@/features/tasks/TaskCalendarPanel";
import { TaskForm } from "@/features/tasks/TaskForm";
import { TaskNotesFeed } from "@/features/tasks/TaskNotesFeed";
import { prisma } from "@/lib/db";
import { getOrganizationOptions, taskDetailInclude } from "@/lib/tasks/task-queries";

export const dynamic = "force-dynamic";

type TaskPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskPage({ params }: TaskPageProps) {
  const { id } = await params;
  const [task, options] = await Promise.all([
    prisma.task.findFirst({
      where: { id, archivedAt: null },
      include: taskDetailInclude
    }),
    getOrganizationOptions()
  ]);

  if (!task) {
    notFound();
  }

  return (
    <section className="page-section task-detail">
      <Link className="secondary-button task-detail__back" href="/inbox">
        Входящие
      </Link>
      <p className="eyebrow">Задача</p>
      <h2>{task.title}</h2>
      <TaskForm
        task={JSON.parse(JSON.stringify(task))}
        categories={JSON.parse(JSON.stringify(options.categories))}
        contexts={JSON.parse(JSON.stringify(options.contexts))}
        projects={JSON.parse(JSON.stringify(options.projects))}
      />
      <TaskCalendarPanel task={JSON.parse(JSON.stringify(task))} />
      <TaskNotesFeed taskId={task.id} notes={JSON.parse(JSON.stringify(task.notes))} />
    </section>
  );
}
