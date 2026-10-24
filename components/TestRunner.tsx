"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { newId, saveAttempt } from "@/lib/history";
import {
  LISTENING_SECONDS_PER_QUESTION,
  estimateLevel,
  getPart,
  questionCount,
  type PartDef,
  type Skill,
  type TestSet,
} from "@/lib/rl";
import { getBuiltinSet, getBuiltinSets } from "@/lib/rl-bank";
import type { ObjectiveResult } from "@/lib/types";
import { ObjectiveReview } from "./ObjectiveReview";
import { useAttempts } from "./useAttempts";
import { Panel, QuestionList, SectionMaterial, Transcript } from "./TestParts";
import { FEATURES } from "@/lib/features";
import { ComingSoon, btn, formatClock } from "./ui";
import { useCountdown } from "./useCountdown";
import { useSpeech } from "./useSpeech";

type Phase = "setup" | "loading" | "running" | "results";
type GenStatus = { partId: string; state: "pending" | "done" | "error"; error?: string };

export function TestRunner({
  skill,
  partIds,
  presetSets,
  onComplete,
}: {
  skill: Skill;
  partIds: string[];
  /** Mock exam: start straight away with these sets. */
  presetSets?: TestSet[];
  /** Mock exam: hand back the result instead of showing and saving it. */
  onComplete?: (r: ObjectiveResult) => void;
}) {
  const parts = partIds.map((id) => getPart(skill, id)!);
  const isFull = parts.length > 1;
  const [phase, setPhase] = useState<Phase>(presetSets ? "running" : "setup");
  const [sets, setSets] = useState<TestSet[]>(presetSets ?? []);
  const [gen, setGen] = useState<GenStatus[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ObjectiveResult>();
  const [picked, setPicked] = useState<number>();
  const attempts = useAttempts();

  // Built-in Test N = the Nth built-in set of every part.
  const perPart = parts.map((p) => getBuiltinSets(skill, p.id));
  const builtinTests = Array.from({ length: Math.min(...perPart.map((s) => s.length)) }, (_, i) => perPart.map((s) => s[i]));

  // Best previous score for each built-in test.
  const bestScores = builtinTests.map((test) => {
    const ids = test.map((s) => s.id).join();
    let best: { correct: number; total: number } | undefined;
    for (const a of attempts) {
      if (a.result.mode !== "objective" || a.result.sets.map((s) => s.id).join() !== ids) continue;
      if (!best || a.result.correct > best.correct) best = { correct: a.result.correct, total: a.result.total };
    }
    return best;
  });
  const firstNew = bestScores.findIndex((b) => !b);
  const selected = picked ?? (firstNew === -1 ? 0 : firstNew);

  function start(chosen: TestSet[]) {
    setSets(chosen);
    setAnswers({});
    setCurrent(0);
    setResult(undefined);
    setPhase("running");
  }

  function startBuiltin() {
    start(builtinTests[selected]);
  }

  async function generate() {
    setPhase("loading");
    setGen(parts.map((p) => ({ partId: p.id, state: "pending" })));
    const results = await Promise.all(
      parts.map(async (p): Promise<TestSet | null> => {
        try {
          const res = await fetch("/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ skill, partId: p.id }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Generation failed.");
          setGen((g) => g.map((s) => (s.partId === p.id ? { ...s, state: "done" } : s)));
          return data as TestSet;
        } catch (e) {
          const error = e instanceof Error ? e.message : "Generation failed.";
          setGen((g) => g.map((s) => (s.partId === p.id ? { ...s, state: "error", error } : s)));
          return null;
        }
      }),
    );
    if (results.every(Boolean)) start(results as TestSet[]);
    else setSets(results.map((r, i) => r ?? getBuiltinSet(skill, parts[i].id)!));
  }

  function finishPart() {
    if (current < sets.length - 1) {
      setCurrent((c) => c + 1);
      window.scrollTo({ top: 0 });
      return;
    }
    const total = sets.reduce((n, s) => n + questionCount(s), 0);
    const correct = sets.reduce(
      (n, s) => n + s.sections.flatMap((sec) => sec.questions).filter((q) => answers[q.id] === q.answer).length,
      0,
    );
    const r: ObjectiveResult = {
      mode: "objective", skill, correct, total, level: estimateLevel(skill, correct, total), sets, answers,
    };
    if (onComplete) return onComplete(r);
    setResult(r);
    setPhase("results");
    window.scrollTo({ top: 0 });
    saveAttempt({
      id: newId(),
      createdAt: new Date().toISOString(),
      kind: skill,
      taskId: isFull ? "full" : parts[0].id,
      taskName: isFull ? `${skill === "reading" ? "Reading" : "Listening"}: Full test` : `${skill === "reading" ? "Reading" : "Listening"} Part ${parts[0].number}: ${parts[0].name}`,
      promptTitle: sets.map((s) => s.title).join(" · ") + (sets.some((s) => s.source === "ai") ? " (fresh test)" : ""),
      response: "",
      wordCount: 0,
      result: r,
    });
  }

  const setAnswer = (id: string, i: number) => setAnswers((a) => ({ ...a, [id]: i }));

  if (phase === "setup") {
    const totalQ = parts.reduce((n, p) => n + p.sections.reduce((a, b) => a + b, 0), 0);
    const minutes =
      skill === "reading"
        ? parts.reduce((n, p) => n + (p.minutes ?? 0), 0)
        : Math.round(parts.reduce((n, p) => n + p.sections.reduce((a, b) => a + b, 0) * (LISTENING_SECONDS_PER_QUESTION + 25), 0) / 60);
    return (
      <Panel>
        <h2 className="font-semibold text-lg">Before you start</h2>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted list-disc pl-5">
          <li>{totalQ} questions{isFull ? ` across ${parts.length} parts` : ""}, about {minutes} minutes.</li>
          {skill === "reading" ? (
            <li>Each part has its own timer. When time runs out, the part is submitted automatically.</li>
          ) : (
            <>
              <li>Each recording plays <b className="text-ink">once</b>, as in the real test. The questions appear after it ends, and you have {LISTENING_SECONDS_PER_QUESTION} seconds per question.</li>
              <li>Turn your sound on. You can read the transcript and replay it in the review.</li>
            </>
          )}
          <li>You&apos;ll get your score, an estimated CELPIP level and explanations at the end.</li>
        </ul>
        <fieldset className="mt-5">
          <legend className="text-sm font-medium">Choose a test</legend>
          <div className="mt-2 space-y-2" role="radiogroup">
            {builtinTests.map((test, i) => {
              const best = bestScores[i];
              const on = i === selected;
              return (
                <button
                  key={test[0].id}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => setPicked(i)}
                  className={`w-full flex items-center gap-3 text-left rounded-xl border px-4 py-3 transition ${
                    on ? "border-accent bg-accent-soft" : "border-line hover:border-muted"
                  }`}
                >
                  <span className={`size-4 shrink-0 rounded-full border-2 grid place-items-center ${on ? "border-accent" : "border-line"}`} aria-hidden>
                    {on && <span className="size-2 rounded-full bg-accent" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">
                      Test {i + 1}
                      {!isFull && <span className="font-normal">: {test[0].title}</span>}
                    </span>
                    {isFull && <span className="block mt-0.5 text-xs text-muted truncate">{test.map((s) => s.title).join(" · ")}</span>}
                  </span>
                  {best && (
                    <span className="shrink-0 text-xs text-good tabular-nums">
                      ✓ Best {best.correct}/{best.total}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <button onClick={startBuiltin} className={`${btn.primary} mt-4`}>
            Start Test {selected + 1}
          </button>
        </fieldset>
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {!FEATURES.aiGeneration ? (
            <div className="text-left rounded-xl border border-dashed border-line p-4" aria-disabled>
              <span className="flex items-center gap-2 font-medium text-muted">Generate a new test ✦ <ComingSoon /></span>
              <span className="block mt-1 text-sm text-muted">Brand-new {skill === "reading" ? "passages" : "recordings"} and questions every time.</span>
            </div>
          ) : (
          <button onClick={generate} className="text-left rounded-xl border border-accent/40 bg-accent-soft p-4 hover:border-accent transition">
            <span className="font-medium text-accent">Generate a new test ✦</span>
            <span className="block mt-1 text-sm text-muted">
              Brand-new {skill === "reading" ? "passages" : "recordings"} and questions, written just for you. Takes about {isFull ? "1–2 minutes" : "30–60 seconds"}.
            </span>
          </button>
          )}
        </div>
      </Panel>
    );
  }

  if (phase === "loading") {
    const failed = gen.filter((g) => g.state === "error");
    const done = gen.every((g) => g.state !== "pending");
    return (
      <Panel>
        <h2 className="font-semibold text-lg">{done ? (failed.length ? "Some parts couldn't be generated" : "Ready") : "Writing your test…"}</h2>
        <ul className="mt-4 space-y-2.5">
          {gen.map((g) => {
            const p = getPart(skill, g.partId)!;
            return (
              <li key={g.partId} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 size-4 shrink-0 grid place-items-center">
                  {g.state === "pending" && <span className="size-3.5 rounded-full border-2 border-line border-t-accent animate-spin" />}
                  {g.state === "done" && <span className="text-good">✓</span>}
                  {g.state === "error" && <span className="text-accent">!</span>}
                </span>
                <span>
                  Part {p.number}: {p.name}
                  {g.error && <span className="block text-accent">{g.error}</span>}
                </span>
              </li>
            );
          })}
        </ul>
        {done && failed.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            <button className={btn.primary} onClick={generate}>Try again</button>
            <button className={btn.secondary} onClick={() => start(sets)}>
              Continue with built-in {failed.length === gen.length ? "test" : `for ${failed.length === 1 ? "that part" : "those parts"}`}
            </button>
          </div>
        )}
      </Panel>
    );
  }

  if (phase === "results" && result) {
    return (
      <div className="space-y-6">
        <ObjectiveReview result={result} />
        <div className="flex flex-wrap gap-2">
          <button className={btn.primary} onClick={() => setPhase("setup")}>Take another test</button>
          <Link href={`/${skill}`} className={btn.secondary}>All {skill} parts</Link>
          <Link href="/history" className={btn.secondary}>View progress</Link>
        </div>
      </div>
    );
  }

  const set = sets[current];
  const part = getPart(skill, set.partId)!;
  return (
    <div className="space-y-4">
      {isFull && (
        <div className="flex items-center gap-1.5" aria-label={`Part ${current + 1} of ${sets.length}`}>
          {sets.map((_, i) => (
            <span key={i} className={`h-1.5 flex-1 rounded-full ${i < current ? "bg-accent" : i === current ? "bg-accent/50" : "bg-line"}`} />
          ))}
        </div>
      )}
      {skill === "reading" ? (
        <ReadingPart
          key={set.id}
          set={set}
          part={part}
          answers={answers}
          onAnswer={setAnswer}
          onDone={finishPart}
          isLast={current === sets.length - 1}
        />
      ) : (
        <ListeningPart key={set.id} set={set} part={part} answers={answers} onAnswer={setAnswer} onDone={finishPart} isLast={current === sets.length - 1} />
      )}
    </div>
  );
}

interface PartProps {
  set: TestSet;
  part: PartDef;
  answers: Record<string, number>;
  onAnswer: (id: string, i: number) => void;
  onDone: () => void;
  isLast: boolean;
}

function PartHeader({ part, set, right }: { part: PartDef; set: TestSet; right?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Part {part.number}</p>
        <h2 className="text-xl font-semibold">{part.name}</h2>
        <p className="text-sm text-muted">{set.title}{set.source === "ai" ? " · Fresh test" : ""}</p>
      </div>
      {right}
    </div>
  );
}

function ReadingPart({ set, part, answers, onAnswer, onDone, isLast }: PartProps) {
  const total = (part.minutes ?? 10) * 60;
  const timer = useCountdown(onDone);
  const { start } = timer;
  useEffect(() => {
    start(total);
  }, [start, total]);
  const all = set.sections.flatMap((s) => s.questions);
  const unanswered = all.filter((q) => answers[q.id] === undefined).length;
  const starts = set.sections.map((_, i) => 1 + set.sections.slice(0, i).reduce((n, s) => n + s.questions.length, 0));

  return (
    <div className="space-y-5">
      <PartHeader
        part={part}
        set={set}
        right={
          <div className={`font-mono text-lg tabular-nums px-3 py-1.5 rounded-lg border ${timer.remaining < 60 ? "border-accent text-accent" : timer.remaining < 180 ? "border-warn/50 text-warn" : "border-line"}`} aria-live="off">
            {formatClock(timer.remaining)}
          </div>
        }
      />
      {set.sections.map((sec, si) => {
        const first = starts[si];
        return (
          <div key={si} className="grid lg:grid-cols-2 gap-5 items-start">
            <Panel className="lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
              <SectionMaterial section={sec} />
            </Panel>
            <Panel>
              <QuestionList questions={sec.questions} startAt={first} answers={answers} onAnswer={onAnswer} />
            </Panel>
          </div>
        );
      })}
      <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3">
        {unanswered > 0 && <p className="text-sm text-muted">{unanswered} unanswered</p>}
        <button
          className={btn.primary}
          onClick={() => {
            if (unanswered && !confirm(`You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Continue anyway?`)) return;
            timer.stop();
            onDone();
          }}
        >
          {isLast ? "Finish and see results" : "Next part →"}
        </button>
      </div>
    </div>
  );
}

type ListenStage = "ready" | "playing" | "answering";

function ListeningPart({ set, part, answers, onAnswer, onDone, isLast }: PartProps) {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [stage, setStage] = useState<ListenStage>("ready");
  const [fallback, setFallback] = useState(false);
  const speech = useSpeech();
  const canSpeak = speech.supported && !fallback;
  const section = set.sections[sectionIdx];
  const speakers = useMemo(() => set.speakers ?? [], [set.speakers]);
  const startAt = 1 + set.sections.slice(0, sectionIdx).reduce((n, s) => n + s.questions.length, 0);
  const lastSection = sectionIdx === set.sections.length - 1;

  const timer = useCountdown(() => advance());

  function play() {
    setStage("playing");
    if (!canSpeak) return;
    speech.play(
      section.script ?? [],
      speakers,
      () => {
        setStage("answering");
        timer.start(section.questions.length * LISTENING_SECONDS_PER_QUESTION);
      },
      () => setFallback(true),
    );
  }

  function doneReading() {
    setStage("answering");
    timer.start(section.questions.length * LISTENING_SECONDS_PER_QUESTION);
  }

  function advance() {
    timer.stop();
    speech.stop();
    if (lastSection) onDone();
    else {
      setSectionIdx((i) => i + 1);
      setStage("ready");
    }
  }

  return (
    <div className="space-y-5">
      <PartHeader
        part={part}
        set={set}
        right={
          stage === "answering" ? (
            <div className={`font-mono text-lg tabular-nums px-3 py-1.5 rounded-lg border ${timer.remaining < 15 ? "border-accent text-accent" : "border-line"}`}>
              {formatClock(timer.remaining)}
            </div>
          ) : undefined
        }
      />
      {set.sections.length > 1 && (
        <p className="text-sm text-muted">Section {sectionIdx + 1} of {set.sections.length}</p>
      )}

      {stage === "ready" && (
        <Panel className="text-center py-10">
          <p className="text-muted text-sm">
            {sectionIdx === 0 ? "You will hear the recording once." : "The conversation continues."} Then answer {section.questions.length} question{section.questions.length > 1 ? "s" : ""}.
          </p>
          <button className={`${btn.primary} mt-5`} onClick={play}>
            ▶ Play {set.sections.length > 1 ? `section ${sectionIdx + 1}` : "recording"}
          </button>
          {speech.supported && !speech.hasVoices && !fallback && (
            <p className="mt-4 text-xs text-muted">Loading voices…</p>
          )}
        </Panel>
      )}

      {stage === "playing" && (
        <Panel className="py-10">
          {canSpeak ? (
            <div className="text-center">
              <p className="text-sm text-muted">Listening… the recording plays once</p>
              <div className="mt-6 flex flex-wrap justify-center gap-4">
                {speakers.map((s) => {
                  const active = speech.speaking === s.name;
                  return (
                    <div key={s.name} className="flex flex-col items-center gap-2">
                      <span
                        className={`grid place-items-center size-14 rounded-full text-lg font-semibold transition ${
                          active ? "bg-accent text-accent-ink scale-110 shadow-lg" : "bg-surface-2 text-muted"
                        }`}
                      >
                        {s.name[0]}
                      </span>
                      <span className={`text-sm ${active ? "font-medium" : "text-muted"}`}>{s.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="rounded-lg bg-warn-soft text-warn p-3 text-sm">
                Your browser can&apos;t play speech, so here is the transcript instead. Read it once, then continue.
              </p>
              <Transcript section={section} />
              <button className={btn.primary} onClick={doneReading}>Go to the questions</button>
            </div>
          )}
        </Panel>
      )}

      {stage === "answering" && (
        <Panel>
          <QuestionList questions={section.questions} startAt={startAt} answers={answers} onAnswer={onAnswer} />
          <div className="mt-6 flex justify-end">
            <button className={btn.primary} onClick={advance}>
              {lastSection ? (isLast ? "Finish and see results" : "Next part →") : "Next section →"}
            </button>
          </div>
        </Panel>
      )}
    </div>
  );
}
