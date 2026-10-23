import type { ReactNode } from "react";
import type { Prompt } from "@/lib/celpip";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-accent text-accent-ink px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:bg-surface-2 disabled:opacity-40 disabled:cursor-not-allowed transition",
  ghost: "inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink transition",
};

export function ComingSoon({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center rounded-full bg-surface-2 border border-line px-2 py-0.5 text-[11px] font-medium text-muted whitespace-nowrap ${className}`}>
      Coming soon
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-line bg-surface ${className}`}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-medium uppercase tracking-wider text-accent">{children}</p>;
}

export function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.ceil(totalSeconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function PromptCard({
  prompt,
  choice,
  onChoose,
  pointsLabel = "In your response:",
}: {
  prompt: Prompt;
  choice?: string;
  onChoose?: (label: string) => void;
  pointsLabel?: string;
}) {
  return (
    <Card className="p-5 sm:p-6">
      <h2 className="font-semibold text-lg">{prompt.title}</h2>
      <p className="mt-2 leading-relaxed">{prompt.body}</p>
      {prompt.points && (
        <>
          <p className="mt-4 text-sm font-medium text-muted">{pointsLabel}</p>
          <ul className="mt-2 space-y-1.5">
            {prompt.points.map((p) => (
              <li key={p} className="flex gap-2 leading-relaxed">
                <span className="text-accent mt-0.5" aria-hidden>•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </>
      )}
      {prompt.options && (
        <div className="mt-4 grid sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Choose an option">
          {prompt.options.map((o) => {
            const selected = choice === o.label;
            return (
              <button
                key={o.label}
                type="button"
                role="radio"
                aria-checked={selected}
                disabled={!onChoose}
                onClick={() => onChoose?.(o.label)}
                className={`text-left rounded-lg border p-4 transition ${
                  selected ? "border-accent bg-accent-soft" : "border-line hover:border-muted"
                } disabled:cursor-default`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span
                    className={`size-4 rounded-full border-2 ${selected ? "border-accent bg-accent" : "border-line"}`}
                    aria-hidden
                  />
                  {o.label}
                </span>
                <span className="block mt-1.5 text-sm text-muted leading-relaxed">{o.detail}</span>
              </button>
            );
          })}
        </div>
      )}
    </Card>
  );
}
