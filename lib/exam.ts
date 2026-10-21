// Full CELPIP-General mock exam: content, step sequence, saved progress and scoring.
import { SPEAKING_TASKS, WRITING_TASKS, type Prompt } from "./celpip";
import { LISTENING_PARTS, READING_PARTS, type TestSet } from "./rl";
import { getBuiltinSet } from "./rl-bank";
import type { ExamSkill, ExamTaskResult, GradeRequest, ObjectiveResult } from "./types";

export interface ExamContent {
  source: "builtin" | "ai";
  listening: TestSet[];
  reading: TestSet[];
  /** One prompt per writing task, in order. */
  writing: Prompt[];
  /** One prompt per speaking task, in order. */
  speaking: Prompt[];
}

export type Step =
  | { type: "listening" }
  | { type: "reading" }
  | { type: "writing"; index: number }
  | { type: "speaking"; index: number }
  | { type: "break"; next: ExamSkill }
  | { type: "grading" };

export const STEPS: Step[] = [
  { type: "listening" },
  { type: "break", next: "reading" },
  { type: "reading" },
  { type: "break", next: "writing" },
  ...WRITING_TASKS.map((_, index) => ({ type: "writing" as const, index })),
  { type: "break", next: "speaking" },
  ...SPEAKING_TASKS.map((_, index) => ({ type: "speaking" as const, index })),
  { type: "grading" },
];

export const SKILL_ORDER: ExamSkill[] = ["listening", "reading", "writing", "speaking"];

export const SKILL_LABEL: Record<ExamSkill, string> = {
  listening: "Listening",
  reading: "Reading",
  writing: "Writing",
  speaking: "Speaking",
};

export const SECTION_INFO: Record<ExamSkill, string> = {
  listening: "6 parts · 38 questions · about 40 minutes",
  reading: "4 parts · 38 questions · 43 minutes",
  writing: "2 tasks · 53 minutes",
  speaking: "8 tasks · about 20 minutes · microphone needed",
};

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function builtinContent(): ExamContent {
  // Speaking Tasks 3 and 4 use the same scene in the real test, so keep them paired.
  const sceneIdx = Math.floor(Math.random() * Math.min(SPEAKING_TASKS[2].prompts.length, SPEAKING_TASKS[3].prompts.length));
  return {
    source: "builtin",
    listening: LISTENING_PARTS.map((p) => getBuiltinSet("listening", p.id)!),
    reading: READING_PARTS.map((p) => getBuiltinSet("reading", p.id)!),
    writing: WRITING_TASKS.map((t) => pick(t.prompts)),
    speaking: SPEAKING_TASKS.map((t) => (t.number === 3 || t.number === 4 ? t.prompts[sceneIdx] : pick(t.prompts))),
  };
}

// --- saved progress (so a closed tab doesn't lose a 2-hour exam) ------------

export interface ExamProgress {
  startedAt: string;
  content: ExamContent;
  step: number;
  listening?: ObjectiveResult;
  reading?: ObjectiveResult;
  /** Writing/speaking answers waiting to be scored, keyed "writing-0", "speaking-3"… */
  responses: Record<string, GradeRequest>;
}

const KEY = "celpip-practice:exam-progress:v1";
const listeners = new Set<() => void>();

export function subscribeProgress(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Raw JSON string (stable between calls) for useSyncExternalStore. */
export function getProgressSnapshot(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveProgress(p: ExamProgress | null) {
  try {
    if (p) localStorage.setItem(KEY, JSON.stringify(p));
    else localStorage.removeItem(KEY);
  } catch {
    /* storage full or blocked: the exam still works, it just can't be resumed */
  }
  listeners.forEach((fn) => fn());
}

export function parseProgress(raw: string | null): ExamProgress | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExamProgress;
  } catch {
    return null;
  }
}

// --- scoring ----------------------------------------------------------------

const round1 = (n: number) => Math.round(n * 10) / 10;

function mean(levels: (number | null)[]) {
  const xs = levels.filter((x): x is number => x !== null);
  return xs.length ? round1(xs.reduce((a, b) => a + b, 0) / xs.length) : null;
}

export function computeLevels(
  listening: ObjectiveResult,
  reading: ObjectiveResult,
  writing: ExamTaskResult[],
  speaking: ExamTaskResult[],
) {
  const levels: Record<ExamSkill, number | null> = {
    listening: listening.level,
    reading: reading.level,
    writing: mean(writing.map((t) => t.level)),
    speaking: mean(speaking.map((t) => t.level)),
  };
  return { levels, average: mean(SKILL_ORDER.map((s) => levels[s])) };
}
