"use client";
// A full Writing or Speaking test: every task back to back, scored together at the end.
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { SPEAKING_TASKS, WRITING_TASKS, clbLabel, levelLabel, type Kind, type Prompt } from "@/lib/celpip";
import { countWords } from "@/lib/checks";
import { SKILL_LABEL, builtinContent, mean, scoreTasks } from "@/lib/exam";
import { newId, saveAttempt } from "@/lib/history";
import type { GradeRequest, SectionResult } from "@/lib/types";
import { TaskReview } from "./ExamReport";
import { LevelRing } from "./LevelRing";
import { ScoreQuota } from "./ScoreQuota";
import { SpeakingSession } from "./SpeakingSession";
import { Panel } from "./TestParts";
import { WritingSession } from "./WritingSession";
import { btn } from "./ui";

type View = "intro" | "test" | "grading" | "report";

const tasksOf = (kind: Kind) => (kind === "writing" ? WRITING_TASKS : SPEAKING_TASKS);

export function SectionRunner({ kind }: { kind: Kind }) {
  const tasks = tasksOf(kind);
  const [view, setView] = useState<View>("intro");
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [step, setStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, GradeRequest>>({});
  const [report, setReport] = useState<SectionResult>();

  function begin() {
    const content = builtinContent();
    setPrompts(kind === "writing" ? content.writing : content.speaking);
    setResponses({});
    setStep(0);
    setView("test");
    window.scrollTo({ top: 0 });
  }

  function submit(req: GradeRequest) {
    setResponses((r) => ({ ...r, [`${kind}-${step}`]: req }));
    if (step + 1 < tasks.length) setStep(step + 1);
    else setView("grading");
    window.scrollTo({ top: 0 });
  }

  // Warn before leaving mid-test: answers are only kept in this tab until they are scored.
  useEffect(() => {
    if (view !== "test") return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [view]);

  if (view === "intro") {
    return (
      <Panel>
        <h2 className="font-semibold text-lg">How the full {SKILL_LABEL[kind]} test works</h2>
        <ol className="mt-4 grid sm:grid-cols-2 gap-2">
          {tasks.map((t) => (
            <li key={t.id} className="rounded-lg bg-surface-2 px-4 py-3 flex gap-3">
              <span className="font-semibold tabular-nums text-muted">{t.number}</span>
              <span className="text-sm">{t.name}</span>
            </li>
          ))}
        </ol>
        <ul className="mt-5 space-y-2 text-sm text-muted list-disc pl-5 leading-relaxed">
          <li>
            The tasks run in order with no pause in between, as on test day
            {kind === "speaking" ? ". You'll need a microphone." : `: Task 1 has ${WRITING_TASKS[0].minutes} minutes and Task 2 has ${WRITING_TASKS[1].minutes}.`}
          </li>
          <li>Prompts are picked at random{kind === "speaking" ? ", and Tasks 3 and 4 use the same picture" : ""}.</li>
          <li>
            Every task is scored together at the end, and you get a {SKILL_LABEL[kind]} level from the average.
            This uses {tasks.length} of your daily scores.
          </li>
          <li>Stay on this page until the end: leaving mid-test loses your answers.</li>
        </ul>
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button className={btn.primary} onClick={begin}>Start the full {SKILL_LABEL[kind]} test</button>
          <ScoreQuota />
        </div>
      </Panel>
    );
  }

  if (view === "grading") {
    return (
      <Grading
        kind={kind}
        prompts={prompts}
        responses={responses}
        onDone={(r) => {
          setReport(r);
          setView("report");
          window.scrollTo({ top: 0 });
        }}
      />
    );
  }

  if (view === "report" && report) return <SectionReport result={report} onRetry={() => setView("intro")} />;

  const task = tasks[step];
  return (
    <div className="space-y-6">
      <ol className="flex gap-1.5" aria-label="Test progress">
        {tasks.map((t, i) => (
          <li key={t.id} className={`h-1.5 flex-1 rounded-full ${i < step ? "bg-accent" : i === step ? "bg-accent/50" : "bg-line"}`} />
        ))}
      </ol>
      <div key={`${kind}-${step}`} className="space-y-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-accent">
            {SKILL_LABEL[kind]} · Task {task.number} of {tasks.length}
          </p>
          <h2 className="text-xl font-semibold">{task.name}</h2>
        </div>
        {kind === "writing" ? (
          <WritingSession taskId={task.id} exam={{ prompt: prompts[step], onSubmit: submit }} />
        ) : (
          <SpeakingSession taskId={task.id} exam={{ prompt: prompts[step], onSubmit: submit }} />
        )}
      </div>
    </div>
  );
}

function Grading({
  kind,
  prompts,
  responses,
  onDone,
}: {
  kind: Kind;
  prompts: Prompt[];
  responses: Record<string, GradeRequest>;
  onDone: (r: SectionResult) => void;
}) {
  const items = useMemo(
    () => tasksOf(kind).map((t, i) => ({ key: `${kind}-${i}`, kind, task: t, prompt: prompts[i] })),
    [kind, prompts],
  );
  const [done, setDone] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // guard against double-running (and double-billing) in dev
    started.current = true;
    (async () => {
      const tasks = await scoreTasks(items, responses, setDone);
      const result: SectionResult = { mode: "section", skill: kind, level: mean(tasks.map((t) => t.level)), tasks };
      saveAttempt({
        id: newId(),
        createdAt: new Date().toISOString(),
        kind,
        taskId: "full",
        taskName: `Full ${SKILL_LABEL[kind]} test`,
        promptTitle: `${tasks.length} tasks`,
        response: "",
        wordCount: tasks.reduce((n, t) => n + countWords(t.response), 0),
        durationSec: kind === "speaking" ? tasks.reduce((n, t) => n + (t.durationSec ?? 0), 0) : undefined,
        result,
      });
      onDone(result);
    })();
  }, [items, kind, responses, onDone]);

  return (
    <Panel className="text-center py-10">
      <span className="inline-block size-8 rounded-full border-[3px] border-line border-t-accent animate-spin" aria-hidden />
      <h2 className="mt-4 text-xl font-semibold">Scoring your {kind}…</h2>
      <p className="mt-1 text-muted tabular-nums">
        {done} of {items.length} tasks scored. {items.length > 2 ? "This usually takes about a minute." : ""}
      </p>
    </Panel>
  );
}

export function SectionReport({ result, onRetry }: { result: SectionResult; onRetry?: () => void }) {
  const lv = result.level;
  const scored = result.tasks.filter((t) => t.level !== null).length;
  return (
    <div className="space-y-6">
      <Panel>
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <LevelRing level={lv !== null ? Math.round(lv) : 0} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">{SKILL_LABEL[result.skill]} level</p>
            <p className="mt-1 text-3xl font-semibold tabular-nums">{lv !== null ? lv.toFixed(1) : "–"}</p>
            <p className="mt-1 text-muted">
              {lv !== null
                ? `${levelLabel(Math.round(lv))} · about ${clbLabel(Math.round(lv))} · average of ${scored} task${scored === 1 ? "" : "s"}`
                : "No task could be scored this time."}
            </p>
          </div>
        </div>
        {lv !== null && scored < result.tasks.length && (
          <p className="mt-4 rounded-lg bg-warn-soft text-warn p-3 text-sm">
            {result.tasks.length - scored} task{result.tasks.length - scored === 1 ? "" : "s"} couldn&apos;t be scored, so the
            level uses the other {scored}.
          </p>
        )}
        <p className="mt-4 text-xs text-muted">Levels are estimates. Open a task below for its feedback.</p>
      </Panel>

      <section className="space-y-3">
        {result.tasks.map((t) => (
          <TaskReview key={t.taskId} task={t} />
        ))}
      </section>

      {onRetry && (
        <div className="flex flex-wrap gap-2">
          <button className={btn.primary} onClick={onRetry}>Take another full test</button>
          <Link href="/history" className={btn.secondary}>View progress</Link>
        </div>
      )}
    </div>
  );
}
