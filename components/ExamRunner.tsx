"use client";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { SPEAKING_TASKS, WRITING_TASKS, type Prompt } from "@/lib/celpip";
import {
  SECTION_INFO,
  SKILL_LABEL,
  SKILL_ORDER,
  STEPS,
  builtinContent,
  computeLevels,
  getProgressSnapshot,
  parseProgress,
  saveProgress,
  scoreTasks,
  subscribeProgress,
  type ExamContent,
  type ExamProgress,
  type Step,
} from "@/lib/exam";
import { newId, saveAttempt } from "@/lib/history";
import { LISTENING_PARTS, READING_PARTS, type Skill, type TestSet } from "@/lib/rl";
import { getBuiltinSet } from "@/lib/rl-bank";
import type { ExamResult, ExamSkill } from "@/lib/types";
import { ExamReport } from "./ExamReport";
import { SpeakingSession } from "./SpeakingSession";
import { TestRunner } from "./TestRunner";
import { Panel } from "./TestParts";
import { WritingSession } from "./WritingSession";
import { btn } from "./ui";

type View = "intro" | "preparing" | "ready" | "exam" | "report";

function skillOf(step: Step): ExamSkill | null {
  if (step.type === "break") return step.next;
  if (step.type === "grading") return null;
  return step.type;
}

export function ExamRunner() {
  const raw = useSyncExternalStore(subscribeProgress, getProgressSnapshot, () => null);
  const saved = useMemo(() => parseProgress(raw), [raw]);
  const [view, setView] = useState<View>("intro");
  const [progress, setProgress] = useState<ExamProgress | null>(null);
  const [report, setReport] = useState<ExamResult>();
  const [prep, setPrep] = useState({ done: 0, total: 0, fallbacks: 0 });

  function update(p: ExamProgress) {
    setProgress(p);
    saveProgress(p);
  }

  function begin(content: ExamContent) {
    update({ startedAt: new Date().toISOString(), content, step: 0, responses: {} });
    setView("exam");
    window.scrollTo({ top: 0 });
  }

  async function prepareAi() {
    setView("preparing");
    const jobs = 6 + 4 + WRITING_TASKS.length + SPEAKING_TASKS.length;
    let done = 0;
    let fallbacks = 0;
    setPrep({ done: 0, total: jobs, fallbacks: 0 });
    const tick = (ok: boolean) => {
      done++;
      if (!ok) fallbacks++;
      setPrep({ done, total: jobs, fallbacks });
    };
    const post = async <T,>(url: string, body: object): Promise<T> => {
      const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data as T;
    };
    const set = (skill: Skill, partId: string) =>
      post<TestSet>("/api/generate", { skill, partId })
        .then((s) => (tick(true), s))
        .catch(() => (tick(false), getBuiltinSet(skill, partId)!));
    const prompt = (kind: "writing" | "speaking", taskId: string, fallback: Prompt) =>
      post<Prompt>("/api/generate-prompt", { kind, taskId })
        .then((p) => (tick(true), p))
        .catch(() => (tick(false), fallback));

    const fallback = builtinContent();
    const [listening, reading, writing, speaking] = await Promise.all([
      Promise.all(LISTENING_PARTS.map((p) => set("listening", p.id))),
      Promise.all(READING_PARTS.map((p) => set("reading", p.id))),
      Promise.all(WRITING_TASKS.map((t, i) => prompt("writing", t.id, fallback.writing[i]))),
      Promise.all(SPEAKING_TASKS.map((t, i) => prompt("speaking", t.id, fallback.speaking[i]))),
    ]);
    setProgress({ startedAt: "", content: { source: "ai", listening, reading, writing, speaking }, step: 0, responses: {} });
    setView("ready");
  }

  function advance(patch: Partial<ExamProgress> = {}) {
    if (!progress) return;
    update({ ...progress, ...patch, step: progress.step + 1 });
    window.scrollTo({ top: 0 });
  }

  // Warn before leaving mid-exam (progress is saved after each task, but the current one would be lost).
  useEffect(() => {
    if (view !== "exam") return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [view]);

  if (view === "intro") {
    return (
      <div className="space-y-5">
        {saved && (
          <Panel className="border-accent/40">
            <p className="font-semibold">You have an exam in progress</p>
            <p className="mt-1 text-sm text-muted">
              Started {new Date(saved.startedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })} ·{" "}
              {describeStep(STEPS[saved.step])}. The task you were on will restart.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                className={btn.primary}
                onClick={() => {
                  setProgress(saved);
                  setView("exam");
                }}
              >
                Resume exam
              </button>
              <button className={btn.secondary} onClick={() => confirm("Discard this exam? Your answers so far will be lost.") && saveProgress(null)}>
                Discard
              </button>
            </div>
          </Panel>
        )}
        <Panel>
          <h2 className="font-semibold text-lg">How the mock exam works</h2>
          <ol className="mt-4 grid sm:grid-cols-2 gap-3">
            {SKILL_ORDER.map((s, i) => (
              <li key={s} className="rounded-lg bg-surface-2 p-4">
                <p className="text-xs text-muted">Section {i + 1}</p>
                <p className="font-semibold">{SKILL_LABEL[s]}</p>
                <p className="text-sm text-muted mt-1">{SECTION_INFO[s]}</p>
              </li>
            ))}
          </ol>
          <ul className="mt-5 space-y-2 text-sm text-muted list-disc pl-5 leading-relaxed">
            <li>The sections run in the official order. It takes about 2½ hours, with a short break screen between sections.</li>
            <li>Reading and listening are marked instantly. Writing and speaking are scored together at the end, as on test day.</li>
            <li>Your report shows a CELPIP level for each skill and the <b className="text-ink">average across all four</b>.</li>
            <li>Progress is saved after every task, so you can close the tab and resume later.</li>
          </ul>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <button onClick={() => begin(builtinContent())} className="text-left rounded-xl border border-line p-4 hover:border-muted transition">
              <span className="font-medium">Start with built-in content</span>
              <span className="block mt-1 text-sm text-muted">Starts instantly. Writing and speaking prompts are picked at random.</span>
            </button>
            <button onClick={prepareAi} className="text-left rounded-xl border border-accent/40 bg-accent-soft p-4 hover:border-accent transition">
              <span className="font-medium text-accent">Generate a fresh exam ✦</span>
              <span className="block mt-1 text-sm text-muted">Brand-new passages, recordings and prompts written just for you. Takes 1–2 minutes.</span>
            </button>
          </div>
        </Panel>
      </div>
    );
  }

  if (view === "preparing" || view === "ready") {
    return (
      <Panel>
        <h2 className="font-semibold text-lg">{view === "ready" ? "Your exam is ready" : "Writing your exam…"}</h2>
        <div className="mt-4 h-2 rounded-full bg-surface-2 overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-[width]" style={{ width: `${(prep.done / Math.max(1, prep.total)) * 100}%` }} />
        </div>
        <p className="mt-2 text-sm text-muted tabular-nums">
          {prep.done} of {prep.total} parts and prompts
          {prep.fallbacks > 0 && ` · ${prep.fallbacks} couldn't be generated and will use built-in content`}
        </p>
        {view === "ready" && progress && (
          <button className={`${btn.primary} mt-5`} onClick={() => begin(progress.content)}>
            Start the exam
          </button>
        )}
      </Panel>
    );
  }

  if (view === "report" && report) return <ExamReport result={report} />;

  if (!progress) return null;
  const step = STEPS[progress.step];
  const current = skillOf(step);
  const { content } = progress;

  return (
    <div className="space-y-6">
      <ol className="grid grid-cols-4 gap-1.5 text-xs" aria-label="Exam sections">
        {SKILL_ORDER.map((s, i) => {
          const idx = current ? SKILL_ORDER.indexOf(current) : 4;
          const state = i < idx ? "done" : i === idx ? "current" : "todo";
          return (
            <li key={s} className="space-y-1.5">
              <span className={`block h-1.5 rounded-full ${state === "done" ? "bg-accent" : state === "current" ? "bg-accent/50" : "bg-line"}`} />
              <span className={state === "current" ? "font-medium" : "text-muted"}>{SKILL_LABEL[s]}</span>
            </li>
          );
        })}
      </ol>

      {step.type === "listening" && (
        <TestRunner
          key="listening"
          skill="listening"
          partIds={content.listening.map((s) => s.partId)}
          presetSets={content.listening}
          onComplete={(r) => advance({ listening: r })}
        />
      )}
      {step.type === "reading" && (
        <TestRunner
          key="reading"
          skill="reading"
          partIds={content.reading.map((s) => s.partId)}
          presetSets={content.reading}
          onComplete={(r) => advance({ reading: r })}
        />
      )}
      {step.type === "writing" && (
        <div key={`w${step.index}`} className="space-y-4">
          <TaskHeading skill="writing" index={step.index} />
          <WritingSession
            taskId={WRITING_TASKS[step.index].id}
            exam={{
              prompt: content.writing[step.index],
              onSubmit: (req) => advance({ responses: { ...progress.responses, [`writing-${step.index}`]: req } }),
            }}
          />
        </div>
      )}
      {step.type === "speaking" && (
        <div key={`s${step.index}`} className="space-y-4">
          <TaskHeading skill="speaking" index={step.index} />
          <SpeakingSession
            taskId={SPEAKING_TASKS[step.index].id}
            exam={{
              prompt: content.speaking[step.index],
              onSubmit: (req) => advance({ responses: { ...progress.responses, [`speaking-${step.index}`]: req } }),
            }}
          />
        </div>
      )}
      {step.type === "break" && (
        <Panel className="text-center py-10">
          <p className="text-sm text-muted">Take a short break if you need one.</p>
          <h2 className="mt-2 text-2xl font-semibold">Next: {SKILL_LABEL[step.next]}</h2>
          <p className="mt-1 text-muted">{SECTION_INFO[step.next]}</p>
          <button className={`${btn.primary} mt-6`} onClick={() => advance()}>
            Start the {SKILL_LABEL[step.next]} section
          </button>
        </Panel>
      )}
      {step.type === "grading" && (
        <GradingStep
          progress={progress}
          onDone={(result) => {
            setReport(result);
            setView("report");
            window.scrollTo({ top: 0 });
          }}
        />
      )}
    </div>
  );
}

function describeStep(step: Step | undefined) {
  if (!step) return "finished";
  switch (step.type) {
    case "listening":
    case "reading":
      return `${SKILL_LABEL[step.type]} section`;
    case "writing":
      return `Writing Task ${step.index + 1}`;
    case "speaking":
      return `Speaking Task ${step.index + 1}`;
    case "break":
      return `before the ${SKILL_LABEL[step.next]} section`;
    case "grading":
      return "ready to be scored";
  }
}

function TaskHeading({ skill, index }: { skill: "writing" | "speaking"; index: number }) {
  const tasks = skill === "writing" ? WRITING_TASKS : SPEAKING_TASKS;
  const t = tasks[index];
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wider text-accent">
        {SKILL_LABEL[skill]} · Task {t.number} of {tasks.length}
      </p>
      <h2 className="text-xl font-semibold">{t.name}</h2>
    </div>
  );
}

/** Scores every writing and speaking answer (4 at a time), then builds and saves the report. */
function GradingStep({ progress, onDone }: { progress: ExamProgress; onDone: (r: ExamResult) => void }) {
  const items = useMemo(
    () => [
      ...WRITING_TASKS.map((t, i) => ({ key: `writing-${i}`, kind: "writing" as const, task: t, prompt: progress.content.writing[i] })),
      ...SPEAKING_TASKS.map((t, i) => ({ key: `speaking-${i}`, kind: "speaking" as const, task: t, prompt: progress.content.speaking[i] })),
    ],
    [progress],
  );
  const [done, setDone] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return; // guard against double-running (and double-billing) in dev
    started.current = true;

    (async () => {
      const out = await scoreTasks(items, progress.responses, setDone);
      const writing = out.filter((t) => t.kind === "writing");
      const speaking = out.filter((t) => t.kind === "speaking");
      const { levels, average } = computeLevels(progress.listening!, progress.reading!, writing, speaking);
      const result: ExamResult = {
        mode: "exam",
        source: progress.content.source,
        levels,
        average,
        listening: progress.listening!,
        reading: progress.reading!,
        writing,
        speaking,
      };
      saveAttempt({
        id: newId(),
        createdAt: new Date().toISOString(),
        kind: "exam",
        taskId: "exam",
        taskName: "Full mock exam",
        promptTitle: progress.content.source === "ai" ? "Fresh content" : "Built-in content",
        response: "",
        wordCount: 0,
        result,
      });
      saveProgress(null);
      onDone(result);
    })();
  }, [items, progress, onDone]);

  return (
    <Panel className="text-center py-10">
      <span className="inline-block size-8 rounded-full border-[3px] border-line border-t-accent animate-spin" aria-hidden />
      <h2 className="mt-4 text-xl font-semibold">Scoring your writing and speaking…</h2>
      <p className="mt-1 text-muted tabular-nums">
        {done} of {items.length} tasks scored. This usually takes about a minute.
      </p>
    </Panel>
  );
}
