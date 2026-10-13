import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { WRITING_TASKS, getWritingTask } from "@/lib/celpip";
import { WritingSession } from "@/components/WritingSession";
import { Eyebrow, btn } from "@/components/ui";

export function generateStaticParams() {
  return WRITING_TASKS.map((t) => ({ taskId: t.id }));
}

export default function WritingTaskPage({ params }: PageProps<"/writing/[taskId]">) {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <TaskContent params={params} />
    </Suspense>
  );
}

async function TaskContent({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = getWritingTask(taskId);
  if (!task) notFound();
  return (
    <div className="space-y-6">
      <Link href="/writing" className={btn.ghost}>← All writing tasks</Link>
      <div>
        <Eyebrow>Writing Task {task.number}</Eyebrow>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">{task.name}</h1>
        <p className="mt-1 text-muted">{task.summary}</p>
      </div>
      <WritingSession taskId={task.id} />
    </div>
  );
}
