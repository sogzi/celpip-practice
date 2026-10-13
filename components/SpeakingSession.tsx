"use client";
import Link from "next/link";
import { useState } from "react";
import { getSpeakingTask } from "@/lib/celpip";
import { countWords } from "@/lib/checks";
import { newId, saveAttempt } from "@/lib/history";
import type { GradeRequest, GradeResult } from "@/lib/types";
import { FeedbackView } from "./FeedbackView";
import { PromptPicker } from "./PromptPicker";
import { Card, PromptCard, btn, formatClock } from "./ui";
import { useCountdown } from "./useCountdown";
import { useRecorder } from "./useRecorder";

type Phase = "ready" | "prep" | "speaking" | "review" | "grading" | "done";

function TimerBar({ label, remaining, total, tone }: { label: string; remaining: number; total: number; tone: "prep" | "rec" }) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-medium">
          {tone === "rec" && <span className="size-2.5 rounded-full bg-accent animate-pulse" aria-hidden />}
          {label}
        </p>
        <p className="font-mono text-2xl tabular-nums" aria-live="polite">{formatClock(remaining)}</p>
      </div>
      <div className="mt-3 h-2 rounded-full bg-surface-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-200 ease-linear ${tone === "rec" ? "bg-accent" : "bg-muted"}`}
          style={{ width: `${(remaining / total) * 100}%` }}
        />
      </div>
    </Card>
  );
}

export function SpeakingSession({ taskId }: { taskId: string }) {
  const task = getSpeakingTask(taskId)!;
  const [promptId, setPromptId] = useState(task.prompts[0].id);
  const [phase, setPhase] = useState<Phase>("ready");
  const [choice, setChoice] = useState<string>();
  const [result, setResult] = useState<GradeResult>();
  const [error, setError] = useState<string>();
  const [duration, setDuration] = useState(0);
  const recorder = useRecorder();

  const prompt = task.prompts.find((p) => p.id === promptId)!;
  const needsChoice = !!prompt.options;
  const isScene = task.number === 3 || task.number === 4 || task.number === 8;

  const speakTimer = useCountdown(() => finishSpeaking());
  const prepTimer = useCountdown(() => startSpeaking());

  async function begin() {
    if (!(await recorder.prepare())) return;
    setPhase("prep");
    prepTimer.start(task.prepSeconds);
  }

  function startSpeaking() {
    prepTimer.stop();
    recorder.start();
    setPhase("speaking");
    speakTimer.start(task.speakSeconds);
  }

  function finishSpeaking() {
    speakTimer.stop();
    setDuration(recorder.stop());
    setPhase("review");
  }

  function reset(nextPrompt = promptId) {
    prepTimer.stop();
    speakTimer.stop();
    recorder.stop();
    recorder.setTranscript("");
    setPromptId(nextPrompt);
    setChoice(undefined);
    setResult(undefined);
    setError(undefined);
    setPhase("ready");
  }

  async function submit() {
    setPhase("grading");
    setError(undefined);
    const body: GradeRequest = {
      kind: "speaking", taskId, promptId, response: recorder.transcript, choice: needsChoice ? choice ?? "" : undefined,
      durationSec: duration,
    };
    try {
      const res = await fetch("/api/grade", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Grading failed.");
      setResult(data);
      setPhase("done");
      saveAttempt({
        id: newId(), createdAt: new Date().toISOString(), kind: "speaking", taskId,
        taskName: `Speaking Task ${task.number}: ${task.name}`, promptTitle: prompt.title,
        response: recorder.transcript, choice, wordCount: countWords(recorder.transcript),
        durationSec: duration, result: data,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Grading failed.");
      setPhase("review");
    }
  }

  const busy = phase === "prep" || phase === "speaking" || phase === "grading";

  return (
    <div className="space-y-6">
      <PromptPicker prompts={task.prompts} value={promptId} onChange={reset} disabled={busy} />

      {phase === "ready" ? (
        <Card className="p-5 sm:p-6">
          <h2 className="font-semibold text-lg">How this works</h2>
          <ol className="mt-3 space-y-2 text-sm leading-relaxed text-muted list-decimal pl-5">
            <li>Click start. The prompt appears and you get <b className="text-ink">{task.prepSeconds} seconds</b> to prepare{needsChoice ? " and choose an option" : ""}.</li>
            <li>Recording starts automatically. You have <b className="text-ink">{task.speakSeconds} seconds</b> to speak.</li>
            <li>Review your recording and transcript, then submit it for scoring.</li>
          </ol>
          {!recorder.supportsTranscription && (
            <p className="mt-4 rounded-lg bg-warn-soft text-warn p-3 text-sm">
              Your browser can&apos;t transcribe speech live. You can still record, then type what you said before scoring. For automatic transcripts, use Chrome, Edge or Safari.
            </p>
          )}
          <button className={`${btn.primary} mt-5`} onClick={begin}>Start task</button>
          {recorder.error && <p className="mt-3 text-sm text-accent">{recorder.error}</p>}
        </Card>
      ) : (
        <>
          {phase === "prep" && (
            <div className="space-y-3">
              <TimerBar label="Preparation time" remaining={prepTimer.remaining} total={task.prepSeconds} tone="prep" />
              <button className={btn.ghost} onClick={startSpeaking}>Skip to recording →</button>
            </div>
          )}
          {phase === "speaking" && (
            <div className="space-y-3">
              <TimerBar label="Recording" remaining={speakTimer.remaining} total={task.speakSeconds} tone="rec" />
              <button className={btn.secondary} onClick={finishSpeaking}>Stop early</button>
            </div>
          )}

          <PromptCard
            prompt={prompt}
            choice={choice}
            onChoose={phase === "prep" ? setChoice : undefined}
            pointsLabel={isScene ? "What you can see:" : "Details:"}
          />

          {phase === "speaking" && recorder.supportsTranscription && (
            <Card className="p-5">
              <p className="text-xs font-medium uppercase tracking-wider text-muted">Live transcript</p>
              <p className="mt-2 leading-relaxed min-h-12">
                {recorder.transcript} <span className="text-muted">{recorder.interim}</span>
                {!recorder.transcript && !recorder.interim && <span className="text-muted">Listening…</span>}
              </p>
            </Card>
          )}
        </>
      )}

      {(phase === "review" || phase === "grading") && (
        <Card className="p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-lg">Review your answer</h2>
            <p className="text-sm text-muted mt-1">You spoke for {Math.round(duration)} seconds.</p>
          </div>
          {recorder.audioUrl && <audio controls src={recorder.audioUrl} className="w-full" />}
          <div>
            <label htmlFor="transcript" className="text-sm font-medium">Transcript</label>
            <p className="text-xs text-muted mt-0.5">
              {recorder.supportsTranscription
                ? "Fix only words the transcription got wrong. Don't improve your answer — the score should reflect what you actually said."
                : "Type what you said, as closely as you can, including any hesitations."}
            </p>
            <textarea
              id="transcript"
              value={recorder.transcript}
              onChange={(e) => recorder.setTranscript(e.target.value)}
              disabled={phase === "grading"}
              className="mt-2 w-full min-h-40 rounded-lg border border-line bg-surface p-3 leading-relaxed outline-none focus:border-muted disabled:opacity-60"
            />
          </div>
          {needsChoice && !choice && <p className="text-sm text-warn">You didn&apos;t choose an option during preparation; this will count against Task Fulfillment.</p>}
          <div className="flex flex-wrap gap-2">
            <button className={btn.primary} onClick={submit} disabled={phase === "grading" || countWords(recorder.transcript) < 10}>
              {phase === "grading" ? "Scoring…" : "Submit for scoring"}
            </button>
            <button className={btn.secondary} onClick={() => reset()} disabled={phase === "grading"}>Re-record</button>
          </div>
          {countWords(recorder.transcript) < 10 && phase === "review" && (
            <p className="text-sm text-muted">At least 10 words are needed for scoring.</p>
          )}
          {error && <p className="text-sm text-accent">{error}</p>}
        </Card>
      )}

      {phase === "done" && result && (
        <div className="space-y-6">
          <Card className="p-5 space-y-3">
            <p className="font-medium">Your answer</p>
            {recorder.audioUrl && <audio controls src={recorder.audioUrl} className="w-full" />}
            <p className="text-sm leading-relaxed text-muted">{recorder.transcript}</p>
          </Card>
          <FeedbackView result={result} />
          <div className="flex flex-wrap gap-2">
            <button className={btn.primary} onClick={() => reset(task.prompts[(task.prompts.indexOf(prompt) + 1) % task.prompts.length].id)}>
              Try the next prompt
            </button>
            <button className={btn.secondary} onClick={() => reset()}>Retry this prompt</button>
            <Link href="/history" className={btn.secondary}>View progress</Link>
          </div>
        </div>
      )}
    </div>
  );
}
