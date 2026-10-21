"use client";
import { useState } from "react";
import { CRITERIA_HELP, levelLabel } from "@/lib/celpip";
import type { GradeResult } from "@/lib/types";
import { LevelRing } from "./LevelRing";
import { ObjectiveReview } from "./ObjectiveReview";
import { Card } from "./ui";


export function FeedbackView({ result }: { result: GradeResult }) {
  const [showRewrite, setShowRewrite] = useState(false);
  if (result.mode === "objective") return <ObjectiveReview result={result} />;
  if (result.mode === "exam") return null; // rendered by ExamReport

  return (
    <div className="space-y-5">
      {result.mode === "offline" && (
        <div className="rounded-xl border border-warn/40 bg-warn-soft text-warn p-4 text-sm leading-relaxed">
          <p className="font-medium">No CELPIP level this time</p>
          <p className="mt-1">{result.reason}</p>
        </div>
      )}

      {result.mode === "ai" && (
        <>
          <Card className="p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
              <LevelRing level={result.feedback.overallLevel} />
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">Estimated CELPIP level</p>
                <p className="text-lg font-semibold mt-1">{levelLabel(result.feedback.overallLevel)}</p>
                <p className="mt-2 leading-relaxed text-muted">{result.feedback.summary}</p>
              </div>
            </div>
            <div className="mt-6 grid sm:grid-cols-2 gap-3">
              {result.feedback.dimensions.map((d) => (
                <div key={d.name} className="rounded-lg bg-surface-2 p-4">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-medium" title={CRITERIA_HELP[d.name]}>{d.name}</p>
                    <p className="font-semibold tabular-nums">{d.level}<span className="text-muted font-normal text-sm">/12</span></p>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(d.level / 12) * 100}%` }} />
                  </div>
                  <p className="mt-3 text-sm text-muted leading-relaxed">{d.comment}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-5">
            <Card className="p-5">
              <h3 className="font-semibold">What worked</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {result.feedback.strengths.map((s) => (
                  <li key={s} className="flex gap-2"><span className="text-good" aria-hidden>✓</span>{s}</li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold">To reach the next level</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                {result.feedback.improvements.map((s) => (
                  <li key={s} className="flex gap-2"><span className="text-accent" aria-hidden>→</span>{s}</li>
                ))}
              </ul>
            </Card>
          </div>

          {result.feedback.corrections.length > 0 && (
            <Card className="p-5">
              <h3 className="font-semibold">Language fixes</h3>
              <ul className="mt-3 divide-y divide-line">
                {result.feedback.corrections.map((c, i) => (
                  <li key={i} className="py-3 text-sm leading-relaxed">
                    <p>
                      <span className="line-through decoration-accent/70 text-muted">{c.original}</span>
                      <span className="mx-2 text-muted" aria-hidden>→</span>
                      <span className="font-medium">{c.suggestion}</span>
                    </p>
                    <p className="text-muted mt-1">{c.explanation}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card className="p-5">
            <button
              type="button"
              onClick={() => setShowRewrite((v) => !v)}
              className="w-full flex items-center justify-between font-semibold"
              aria-expanded={showRewrite}
            >
              Model answer (level 10–11 rewrite of your response)
              <span className="text-muted text-sm font-normal">{showRewrite ? "Hide" : "Show"}</span>
            </button>
            {showRewrite && (
              <p className="mt-4 whitespace-pre-wrap leading-relaxed text-[15px]">{result.feedback.improvedVersion}</p>
            )}
          </Card>
        </>
      )}

      {result.checks.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold">Automatic checks</h3>
          <ul className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {result.checks.map((c) => (
              <li key={c.label} className="flex gap-2.5 leading-relaxed">
                <span
                  className={`mt-0.5 grid place-items-center size-5 shrink-0 rounded-full text-xs ${
                    c.ok ? "bg-good-soft text-good" : "bg-warn-soft text-warn"
                  }`}
                  aria-label={c.ok ? "Pass" : "Needs work"}
                >
                  {c.ok ? "✓" : "!"}
                </span>
                <span><span className="font-medium">{c.label}.</span> <span className="text-muted">{c.detail}</span></span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {result.mode === "ai" && (
        <p className="text-xs text-muted">Scored by {result.model}. AI scores are estimates and may differ from official CELPIP results.</p>
      )}
    </div>
  );
}
