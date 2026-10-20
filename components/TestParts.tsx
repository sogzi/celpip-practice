"use client";
import { Fragment, type ReactNode } from "react";
import type { Question, Section } from "@/lib/rl";
import { Card } from "./ui";

const LETTERS = "ABCDE";

/** Renders passage text, highlighting blanks like "(7) ______". */
export function PassageText({ text }: { text: string }) {
  return (
    <div className="space-y-3 leading-relaxed text-[15px]">
      {text.split(/\n\s*\n/).map((para, i) => (
        <p key={i} className="whitespace-pre-line">
          {para.split(/(\(\d+\)\s*_{2,})/).map((chunk, j) => {
            const m = chunk.match(/^\((\d+)\)/);
            return m ? (
              <span key={j} className="inline-block mx-0.5 px-2 rounded bg-accent-soft text-accent font-medium text-sm tabular-nums">
                {m[1]} ______
              </span>
            ) : (
              <Fragment key={j}>{chunk}</Fragment>
            );
          })}
        </p>
      ))}
    </div>
  );
}

export function DiagramTable({ table }: { table: NonNullable<Section["table"]> }) {
  return (
    <div className="rounded-lg border border-line overflow-hidden">
      <p className="px-4 py-3 bg-surface-2 font-semibold text-sm">{table.title}</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left">
              {table.headers.map((h) => (
                <th key={h} className="px-3 py-2 font-medium text-muted whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, i) => (
              <tr key={i} className="border-b border-line last:border-0">
                {row.map((cell, j) => (
                  <td key={j} className={`px-3 py-2 align-top ${j === 0 ? "font-medium" : ""}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="px-4 py-2.5 text-sm border-t border-line bg-surface-2">{table.note}</p>}
    </div>
  );
}

export function SectionMaterial({ section }: { section: Section }) {
  return (
    <div className="space-y-4">
      {section.heading && <p className="text-xs font-medium uppercase tracking-wider text-muted">{section.heading}</p>}
      {section.instructions && <p className="text-sm text-muted">{section.instructions}</p>}
      {section.table && <DiagramTable table={section.table} />}
      {section.text && <PassageText text={section.text} />}
    </div>
  );
}

export function Transcript({ section }: { section: Section }) {
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {section.script?.map((l, i) => (
        <p key={i}>
          <span className="font-medium">{l.speaker}:</span> <span className="text-muted">{l.text}</span>
        </p>
      ))}
    </div>
  );
}

export function QuestionBlock({
  number,
  question,
  value,
  onChange,
  review,
}: {
  number: number;
  question: Question;
  value: number | undefined;
  onChange?: (i: number) => void;
  review?: boolean;
}) {
  const correct = value === question.answer;
  // Reading Part 3 uses fixed paragraph labels as options.
  const paragraphLabels = question.options.length === 5 && question.options[0] === "A";
  return (
    <fieldset className="space-y-2">
      <legend className="flex gap-2 font-medium leading-snug mb-2">
        <span className="text-muted tabular-nums shrink-0">{number}.</span>
        <span>{question.prompt}</span>
        {review && (
          <span className={`ml-auto shrink-0 text-xs px-2 py-0.5 rounded-full self-start ${correct ? "bg-good-soft text-good" : "bg-accent-soft text-accent"}`}>
            {correct ? "Correct" : value === undefined ? "No answer" : "Incorrect"}
          </span>
        )}
      </legend>
      <div className="grid gap-1.5">
        {question.options.map((opt, i) => {
          const selected = value === i;
          const isAnswer = review && i === question.answer;
          const wrongPick = review && selected && !correct;
          return (
            <label
              key={i}
              className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                isAnswer
                  ? "border-good bg-good-soft"
                  : wrongPick
                    ? "border-accent bg-accent-soft"
                    : selected
                      ? "border-accent bg-accent-soft"
                      : "border-line hover:border-muted"
              } ${review ? "cursor-default" : "cursor-pointer"}`}
            >
              <input
                type="radio"
                name={question.id}
                className="sr-only"
                checked={selected}
                disabled={review}
                onChange={() => onChange?.(i)}
              />
              <span
                className={`grid place-items-center size-5 shrink-0 rounded-full border text-[11px] font-semibold ${
                  selected || isAnswer ? "border-transparent bg-accent text-accent-ink" : "border-line text-muted"
                } ${isAnswer ? "!bg-good" : ""}`}
                aria-hidden
              >
                {LETTERS[i]}
              </span>
              <span className="leading-snug">{paragraphLabels ? (i < 4 ? `Paragraph ${opt}` : "Not given") : opt}</span>
            </label>
          );
        })}
      </div>
      {review && question.explanation && <p className="text-sm text-muted pl-1">{question.explanation}</p>}
    </fieldset>
  );
}

export function QuestionList({
  questions,
  startAt,
  answers,
  onAnswer,
  review,
}: {
  questions: Question[];
  startAt: number;
  answers: Record<string, number>;
  onAnswer?: (id: string, i: number) => void;
  review?: boolean;
}) {
  return (
    <div className="space-y-6">
      {questions.map((q, i) => (
        <QuestionBlock
          key={q.id}
          number={startAt + i}
          question={q}
          value={answers[q.id]}
          onChange={onAnswer ? (v) => onAnswer(q.id, v) : undefined}
          review={review}
        />
      ))}
    </div>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <Card className={`p-5 sm:p-6 ${className}`}>{children}</Card>;
}
