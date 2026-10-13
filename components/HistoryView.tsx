"use client";
import Link from "next/link";
import { useState } from "react";
import { deleteAttempt } from "@/lib/history";
import type { Attempt } from "@/lib/types";
import { FeedbackView } from "./FeedbackView";
import { Card, btn } from "./ui";
import { useAttempts } from "./useAttempts";

function levelOf(a: Attempt) {
  return a.result.mode === "ai" ? a.result.feedback.overallLevel : null;
}

function Trend({ attempts, label }: { attempts: Attempt[]; label: string }) {
  const scored = attempts.filter((a) => levelOf(a) !== null).slice(0, 12).reverse();
  const levels = scored.map((a) => levelOf(a)!);
  const avg = levels.length ? levels.reduce((s, n) => s + n, 0) / levels.length : null;
  const latest = levels.at(-1);
  const w = 280;
  const h = 72;
  const x = (i: number) => (levels.length === 1 ? w / 2 : (i / (levels.length - 1)) * (w - 12) + 6);
  const y = (lv: number) => h - 6 - ((lv - 1) / 11) * (h - 12);

  return (
    <Card className="p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="font-semibold">{label}</p>
        <p className="text-xs text-muted">{scored.length} scored attempt{scored.length === 1 ? "" : "s"}</p>
      </div>
      <div className="mt-3 flex items-end gap-6">
        <div>
          <p className="text-xs text-muted">Latest</p>
          <p className="text-3xl font-semibold tabular-nums">{latest ?? "–"}</p>
        </div>
        <div>
          <p className="text-xs text-muted">Average</p>
          <p className="text-3xl font-semibold tabular-nums text-muted">{avg ? avg.toFixed(1) : "–"}</p>
        </div>
      </div>
      {levels.length > 0 ? (
        <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full h-20" role="img" aria-label={`${label} levels over time: ${levels.join(", ")}`}>
          {[4, 7, 10].map((lv) => (
            <g key={lv}>
              <line x1="0" x2={w} y1={y(lv)} y2={y(lv)} stroke="var(--line)" strokeDasharray="3 4" />
              <text x={w} y={y(lv) - 3} textAnchor="end" fontSize="9" fill="var(--muted)">{lv}</text>
            </g>
          ))}
          {levels.length > 1 && (
            <polyline
              fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"
              points={levels.map((lv, i) => `${x(i)},${y(lv)}`).join(" ")}
            />
          )}
          {levels.map((lv, i) => (
            <circle key={i} cx={x(i)} cy={y(lv)} r="3.5" fill="var(--surface)" stroke="var(--accent)" strokeWidth="2" />
          ))}
        </svg>
      ) : (
        <p className="mt-4 text-sm text-muted">No scored attempts yet.</p>
      )}
    </Card>
  );
}

export function HistoryView() {
  const attempts = useAttempts();
  const [openId, setOpenId] = useState<string>();

  if (attempts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="font-medium">No attempts yet</p>
        <p className="mt-1 text-sm text-muted">Finish a writing or speaking task and it will show up here.</p>
        <div className="mt-5 flex justify-center gap-2">
          <Link href="/writing" className={btn.primary}>Start writing</Link>
          <Link href="/speaking" className={btn.secondary}>Start speaking</Link>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-5">
        <Trend label="Writing" attempts={attempts.filter((a) => a.kind === "writing")} />
        <Trend label="Speaking" attempts={attempts.filter((a) => a.kind === "speaking")} />
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold">All attempts</h2>
        <ul className="space-y-3">
          {attempts.map((a) => {
            const lv = levelOf(a);
            const open = openId === a.id;
            return (
              <li key={a.id}>
                <Card>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? undefined : a.id)}
                    aria-expanded={open}
                    className="w-full text-left p-4 sm:p-5 flex items-center gap-4"
                  >
                    <span
                      className={`grid place-items-center size-11 shrink-0 rounded-lg font-semibold tabular-nums ${
                        lv ? "bg-accent-soft text-accent" : "bg-surface-2 text-muted"
                      }`}
                    >
                      {lv ?? "–"}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium truncate">{a.taskName}</span>
                      <span className="block text-sm text-muted truncate">
                        {a.promptTitle} · {a.wordCount} words
                        {a.durationSec ? ` · ${Math.round(a.durationSec)}s` : ""}
                      </span>
                    </span>
                    <span className="text-xs text-muted shrink-0 hidden sm:block">
                      {new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                    </span>
                  </button>
                  {open && (
                    <div className="border-t border-line p-4 sm:p-5 space-y-5">
                      <details>
                        <summary className="cursor-pointer text-sm font-medium">Your {a.kind === "writing" ? "response" : "transcript"}</summary>
                        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[15px]">{a.response}</p>
                      </details>
                      <FeedbackView result={a.result} />
                      <button className="text-sm text-muted hover:text-accent" onClick={() => deleteAttempt(a.id)}>
                        Delete this attempt
                      </button>
                    </div>
                  )}
                </Card>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
