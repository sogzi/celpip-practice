"use client";
import Link from "next/link";
import { clbLabel, levelLabel } from "@/lib/celpip";
import { SKILL_LABEL, SKILL_ORDER } from "@/lib/exam";
import type { ExamResult, ExamTaskResult } from "@/lib/types";
import { FeedbackView } from "./FeedbackView";
import { LevelRing } from "./LevelRing";
import { ObjectiveReview } from "./ObjectiveReview";
import { Panel } from "./TestParts";
import { btn } from "./ui";

export function TaskReview({ task }: { task: ExamTaskResult }) {
  return (
    <details className="group rounded-xl border border-line bg-surface">
      <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-3">
        <span>
          <span className="font-semibold">{task.taskName}</span>
          <span className="block text-sm text-muted">{task.promptTitle}</span>
        </span>
        <span className={`grid place-items-center size-10 shrink-0 rounded-lg font-semibold tabular-nums ${task.level ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted"}`}>
          {task.level ?? "–"}
        </span>
      </summary>
      <div className="border-t border-line p-5 space-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted">
            {task.kind === "writing" ? "Your response" : `Your transcript${task.durationSec ? ` · ${Math.round(task.durationSec)}s` : ""}`}
          </p>
          <p className="mt-2 whitespace-pre-wrap leading-relaxed text-[15px]">{task.response || <span className="text-muted">No answer</span>}</p>
        </div>
        <FeedbackView result={task.result} />
      </div>
    </details>
  );
}

export function ExamReport({ result, showActions = true }: { result: ExamResult; showActions?: boolean }) {
  const scored = SKILL_ORDER.filter((s) => result.levels[s] !== null);
  const missing = SKILL_ORDER.filter((s) => result.levels[s] === null);
  const avg = result.average;

  return (
    <div className="space-y-8">
      <Panel>
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <LevelRing level={avg !== null ? Math.round(avg) : 0} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Average CELPIP level</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{avg !== null ? avg.toFixed(1) : "–"}</p>
            {avg !== null && (
              <p className="mt-1 text-muted">
                {levelLabel(Math.round(avg))} · about {clbLabel(Math.round(avg))}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3">
          {SKILL_ORDER.map((s) => {
            const lv = result.levels[s];
            const tasks = s === "writing" ? result.writing : s === "speaking" ? result.speaking : null;
            const obj = s === "listening" ? result.listening : s === "reading" ? result.reading : null;
            return (
              <div key={s} className="rounded-lg bg-surface-2 p-4">
                <p className="text-sm text-muted">{SKILL_LABEL[s]}</p>
                <p className="mt-1 text-3xl font-semibold tabular-nums">{lv !== null ? Math.round(lv) : "–"}</p>
                <p className="mt-1 text-xs text-muted leading-snug">
                  {lv === null
                    ? "Not scored"
                    : obj
                      ? `${obj.correct}/${obj.total} correct`
                      : `${lv.toFixed(1)} average of ${tasks!.filter((t) => t.level !== null).length} tasks`}
                </p>
                {lv !== null && (
                  <div className="mt-3 h-1.5 rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(lv / 12) * 100}%` }} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {missing.length > 0 && (
          <p className="mt-4 rounded-lg bg-warn-soft text-warn p-3 text-sm">
            {missing.map((s) => SKILL_LABEL[s]).join(" and ")} couldn&apos;t be scored this time, so the average
            uses {scored.length} skill{scored.length === 1 ? "" : "s"}.
          </p>
        )}
        <p className="mt-4 text-xs text-muted leading-relaxed">
          CELPIP doesn&apos;t report an overall score; the average is a convenient summary. Immigration programs look at each skill
          separately, usually at its CLB level. All levels here are estimates.
        </p>
      </Panel>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Listening</h2>
        <ObjectiveReview result={result.listening} />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Reading</h2>
        <ObjectiveReview result={result.reading} />
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Writing</h2>
        {result.writing.map((t) => (
          <TaskReview key={t.taskId} task={t} />
        ))}
      </section>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Speaking</h2>
        {result.speaking.map((t) => (
          <TaskReview key={t.taskId} task={t} />
        ))}
      </section>

      {showActions && (
        <div className="flex flex-wrap gap-2">
          <Link href="/history" className={btn.primary}>View progress</Link>
          <Link href="/" className={btn.secondary}>Back to home</Link>
        </div>
      )}
    </div>
  );
}
