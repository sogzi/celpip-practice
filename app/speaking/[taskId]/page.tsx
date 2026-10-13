import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { SPEAKING_TASKS, getSpeakingTask } from "@/lib/celpip";
import { SpeakingSession } from "@/components/SpeakingSession";
import { Eyebrow, btn } from "@/components/ui";

export function generateStaticParams() {
  return SPEAKING_TASKS.map((t) => ({ taskId: t.id }));
}

export default function SpeakingTaskPage({ params }: PageProps<"/speaking/[taskId]">) {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <TaskContent params={params} />
    </Suspense>
  );
}

async function TaskContent({ params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params;
  const task = getSpeakingTask(taskId);
  if (!task) notFound();
  const next = SPEAKING_TASKS.find((t) => t.number === task.number + 1);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/speaking" className={btn.ghost}>← All speaking tasks</Link>
        {next && <Link href={`/speaking/${next.id}`} className={btn.ghost}>Task {next.number} →</Link>}
      </div>
      <div>
        <Eyebrow>Speaking Task {task.number}</Eyebrow>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight">{task.name}</h1>
        <p className="mt-1 text-muted">{task.summary} Prepare {task.prepSeconds}s · speak {task.speakSeconds}s.</p>
      </div>
      <SpeakingSession key={task.id} taskId={task.id} />
    </div>
  );
}
