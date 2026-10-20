"use client";
import { levelLabel } from "@/lib/celpip";
import { getPart, questionCount } from "@/lib/rl";
import type { ObjectiveResult } from "@/lib/types";
import { LevelRing } from "./LevelRing";
import { Panel, QuestionList, SectionMaterial, Transcript } from "./TestParts";
import { useSpeech } from "./useSpeech";

export function ObjectiveReview({ result }: { result: ObjectiveResult }) {
  const speech = useSpeech();
  const pct = Math.round((result.correct / Math.max(1, result.total)) * 100);
  const isFull = result.sets.length > 1;

  return (
    <div className="space-y-5">
      <Panel>
        <div className="flex flex-col sm:flex-row gap-5 sm:items-center">
          <LevelRing level={result.level} />
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Estimated CELPIP level</p>
            <p className="text-lg font-semibold mt-1">{levelLabel(result.level)}</p>
            <p className="mt-2 text-muted">
              You got <b className="text-ink tabular-nums">{result.correct} of {result.total}</b> correct ({pct}%).
              {!isFull && " For a single part, the level is a rough indication based on your percentage."}
            </p>
          </div>
        </div>
        {isFull && (
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            {result.sets.map((set) => {
              const part = getPart(set.skill, set.partId)!;
              const qs = set.sections.flatMap((s) => s.questions);
              const right = qs.filter((q) => result.answers[q.id] === q.answer).length;
              return (
                <div key={set.id} className="rounded-lg bg-surface-2 p-3">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium">Part {part.number}: {part.name}</span>
                    <span className="tabular-nums shrink-0">{right}/{qs.length}</span>
                  </div>
                  <div className="mt-2 h-1.5 rounded-full bg-line overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: `${(right / qs.length) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Panel>

      {result.sets.map((set) => {
        const part = getPart(set.skill, set.partId)!;
        const qs = set.sections.flatMap((s) => s.questions);
        const right = qs.filter((q) => result.answers[q.id] === q.answer).length;
        const starts = set.sections.map((_, i) => 1 + set.sections.slice(0, i).reduce((n, s) => n + s.questions.length, 0));
        return (
          <details key={set.id} className="group rounded-xl border border-line bg-surface" open={!isFull}>
            <summary className="cursor-pointer list-none p-5 flex items-center justify-between gap-3">
              <span>
                <span className="font-semibold">Review Part {part.number}: {part.name}</span>
                <span className="block text-sm text-muted">{set.title}{set.source === "ai" ? " · AI-generated" : ""}</span>
              </span>
              <span className="text-sm tabular-nums text-muted shrink-0">{right}/{questionCount(set)} <span className="group-open:hidden">▸</span><span className="hidden group-open:inline">▾</span></span>
            </summary>
            <div className="border-t border-line p-5 space-y-8">
              {set.sections.map((sec, si) => {
                const first = starts[si];
                return (
                  <div key={si} className="grid lg:grid-cols-2 gap-6 items-start">
                    <div className="space-y-3">
                      {set.skill === "reading" ? (
                        <SectionMaterial section={sec} />
                      ) : (
                        <>
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-medium uppercase tracking-wider text-muted">
                              Transcript{set.sections.length > 1 ? ` · Section ${si + 1}` : ""}
                            </p>
                            {speech.supported && (
                              <button
                                className="text-sm text-accent font-medium"
                                onClick={() =>
                                  speech.speaking ? speech.stop() : speech.play(sec.script ?? [], set.speakers ?? [])
                                }
                              >
                                {speech.speaking ? "■ Stop" : "▶ Play again"}
                              </button>
                            )}
                          </div>
                          <Transcript section={sec} />
                        </>
                      )}
                    </div>
                    <QuestionList questions={sec.questions} startAt={first} answers={result.answers} review />
                  </div>
                );
              })}
            </div>
          </details>
        );
      })}
    </div>
  );
}
