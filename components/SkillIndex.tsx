import Link from "next/link";
import { FEATURES } from "@/lib/features";
import { PARTS, SKILL_INFO, type Skill } from "@/lib/rl";
import { Card, Eyebrow } from "./ui";

export function SkillIndex({ skill }: { skill: Skill }) {
  const parts = PARTS[skill];
  const info = SKILL_INFO[skill];
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>{info.label} test · {parts.length} parts · {info.totalQuestions} questions</Eyebrow>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{info.label} practice</h1>
        <p className="mt-2 text-muted max-w-2xl">
          {skill === "reading"
            ? "Timed parts with passages, diagrams and fill-in-the-blank replies. Answers are marked instantly."
            : "Recordings play once, then you answer within the time limit, just like test day. Answers are marked instantly."}{" "}
          {FEATURES.aiGeneration ? "Use the built-in test or have Claude write a new one." : ""}
        </p>
      </div>

      <Link href={`/${skill}/full`} className="group block">
        <Card className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-accent/40 bg-accent-soft transition group-hover:border-accent">
          <div>
            <p className="font-semibold text-lg group-hover:text-accent">Full {info.label} test</p>
            <p className="text-sm text-muted mt-1">All {parts.length} parts back to back, {info.duration}, with an estimated CELPIP level.</p>
          </div>
          <span className="text-accent font-medium shrink-0">Start →</span>
        </Card>
      </Link>

      <div className="grid sm:grid-cols-2 gap-4">
        {parts.map((p) => {
          const qs = p.sections.reduce((a, b) => a + b, 0);
          return (
            <Link key={p.id} href={`/${skill}/${p.id}`} className="group">
              <Card className="p-5 h-full flex gap-4 transition group-hover:border-muted">
                <span className="grid place-items-center size-10 shrink-0 rounded-lg bg-surface-2 font-semibold tabular-nums group-hover:bg-accent group-hover:text-accent-ink transition">
                  {p.number}
                </span>
                <div>
                  <h2 className="font-semibold group-hover:text-accent">{p.name}</h2>
                  <p className="mt-1 text-sm text-muted leading-relaxed">{p.summary}</p>
                  <p className="mt-2 text-xs text-muted">
                    {qs} questions{p.minutes ? ` · ${p.minutes} min` : ""}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
