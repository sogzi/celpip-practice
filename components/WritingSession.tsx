"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { getWritingTask } from "@/lib/celpip";
import { countWords } from "@/lib/checks";
import { newId, saveAttempt } from "@/lib/history";
import type { GradeRequest, GradeResult } from "@/lib/types";
import { FeedbackView } from "./FeedbackView";
import { PromptPicker } from "./PromptPicker";
import { useGeneratedPrompts } from "./useGeneratedPrompts";
import { PromptCard, btn, formatClock } from "./ui";
import { useCountdown } from "./useCountdown";

type Phase = "ready" | "writing" | "grading" | "done";

export function WritingSession({ taskId }: { taskId: string }) {
  const task = getWritingTask(taskId)!;
  const [promptId, setPromptId] = useState(task.prompts[0].id);
  const [phase, setPhase] = useState<Phase>("ready");
  const [text, setText] = useState("");
  const [choice, setChoice] = useState<string>();
  const [timeUp, setTimeUp] = useState(false);
  const [result, setResult] = useState<GradeResult>();
  const [error, setError] = useState<string>();
  const startedAt = useRef(0);
  const timer = useCountdown(() => setTimeUp(true));

  const promptList = useGeneratedPrompts("writing", taskId, task.prompts);
  const prompts = promptList.prompts;
  const prompt = prompts.find((p) => p.id === promptId)!;
  const words = countWords(text);
  const inRange = words >= task.minWords && words <= task.maxWords;
  const needsChoice = !!prompt.options;

  function begin() {
    startedAt.current = Date.now();
    setPhase("writing");
    setTimeUp(false);
    timer.start(task.minutes * 60);
  }

  function reset(nextPrompt = promptId) {
    timer.stop();
    setPromptId(nextPrompt);
    setPhase("ready");
    setText("");
    setChoice(undefined);
    setResult(undefined);
    setError(undefined);
    setTimeUp(false);
  }

  async function submit() {
    timer.stop();
    setPhase("grading");
    setError(undefined);
    const minutesUsed = (Date.now() - startedAt.current) / 60000;
    const body: GradeRequest = { kind: "writing", taskId, promptId, prompt: promptId.startsWith("ai-") ? prompt : undefined, response: text, choice, minutesUsed };
    try {
      const res = await fetch("/api/grade", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed.");
      setResult(data);
      setPhase("done");
      saveAttempt({
        id: newId(), createdAt: new Date().toISOString(), kind: "writing", taskId,
        taskName: `Writing Task ${task.number}: ${task.name}`, promptTitle: prompt.title,
        response: text, choice, wordCount: words, result: data,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grading failed.");
      setPhase("writing");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <PromptPicker
          prompts={prompts}
          value={promptId}
          onChange={reset}
          disabled={phase === "writing" || phase === "grading"}
          onGenerate={async () => {
            const p = await promptList.generate();
            if (p) reset(p.id);
          }}
          generating={promptList.generating}
          error={promptList.error}
        />
        {phase !== "ready" && phase !== "done" && (
          <div
            className={`self-start sm:self-auto font-mono text-lg tabular-nums px-3 py-1.5 rounded-lg border ${
              timeUp ? "border-accent text-accent bg-accent-soft" : timer.remaining < 300 ? "border-warn/50 text-warn" : "border-line"
            }`}
            aria-live="polite"
          >
            {timeUp ? "Time's up" : formatClock(timer.remaining)}
          </div>
        )}
      </div>

      <PromptCard
        prompt={prompt}
        choice={choice}
        onChoose={phase === "writing" ? setChoice : undefined}
        pointsLabel="In your email, do the following:"
      />

      {phase === "ready" && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button className={btn.primary} onClick={begin}>Start {task.minutes}-minute timer</button>
          <p className="text-sm text-muted">Write {task.minWords}–{task.maxWords} words. The timer starts when you click.</p>
        </div>
      )}

      {(phase === "writing" || phase === "grading") && (
        <div className="space-y-3">
          {needsChoice && !choice && <p className="text-sm text-warn">Choose Option A or Option B above before you submit.</p>}
          <label htmlFor="essay" className="sr-only">Your response</label>
          <textarea
            id="essay"
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={phase === "grading"}
            spellCheck={false}
            placeholder={task.number === 1 ? "Dear …," : "I prefer Option … because …"}
            className="w-full min-h-[22rem] rounded-xl border border-line bg-surface p-4 sm:p-5 leading-relaxed text-[15px] outline-none focus:border-muted resize-y disabled:opacity-60"
          />
          <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
            <p className={`text-sm tabular-nums ${inRange ? "text-good" : words > task.maxWords ? "text-warn" : "text-muted"}`}>
              {words} words <span className="text-muted">· target {task.minWords}–{task.maxWords}</span>
            </p>
            <div className="flex gap-2">
              <button className={btn.secondary} onClick={() => reset()} disabled={phase === "grading"}>Start over</button>
              <button className={btn.primary} onClick={submit} disabled={phase === "grading" || words < 10 || (needsChoice && !choice)}>
                {phase === "grading" ? "Scoring…" : "Submit for scoring"}
              </button>
            </div>
          </div>
          <p className="text-xs text-muted">Spell check is turned off, as in the real test.</p>
          {error && <p className="text-sm text-accent">{error}</p>}
        </div>
      )}

      {phase === "done" && result && (
        <div className="space-y-6">
          <details className="rounded-xl border border-line bg-surface p-5">
            <summary className="cursor-pointer font-medium">Your response ({words} words)</summary>
            <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[15px]">{text}</p>
          </details>
          <FeedbackView result={result} />
          <div className="flex flex-wrap gap-2">
            <button className={btn.primary} onClick={() => reset(prompts[(prompts.indexOf(prompt) + 1) % prompts.length].id)}>
              Try the next prompt
            </button>
            <button
              className={btn.secondary}
              disabled={promptList.generating}
              onClick={async () => {
                const p = await promptList.generate();
                if (p) reset(p.id);
              }}
            >
              {promptList.generating ? "Writing a new prompt…" : "✦ Generate new prompt"}
            </button>
            <button className={btn.secondary} onClick={() => reset()}>Retry this prompt</button>
            <Link href="/history" className={btn.secondary}>View progress</Link>
          </div>
        </div>
      )}
    </div>
  );
}
