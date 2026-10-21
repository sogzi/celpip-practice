import type { Kind, Prompt } from "./celpip";
import type { Skill, TestSet } from "./rl";

export interface GradeRequest {
  kind: Kind | Skill | "exam";
  taskId: string;
  promptId: string;
  /** The prompt itself, when it was AI-generated rather than built in. */
  prompt?: Prompt;
  /** Essay text, or the speech transcript. */
  response: string;
  /** Option chosen for Writing Task 2 / Speaking Tasks 5 & 6. */
  choice?: string;
  /** Speaking only: seconds actually spoken. */
  durationSec?: number;
  /** Writing only: minutes actually used. */
  minutesUsed?: number;
}

export interface Check {
  label: string;
  ok: boolean;
  detail: string;
}

export interface Feedback {
  overallLevel: number;
  summary: string;
  dimensions: { name: string; level: number; comment: string }[];
  strengths: string[];
  improvements: string[];
  corrections: { original: string; suggestion: string; explanation: string }[];
  improvedVersion: string;
}

export interface ObjectiveResult {
  mode: "objective";
  skill: Skill;
  correct: number;
  total: number;
  level: number;
  /** The tests taken and the chosen option per question id, for review. */
  sets: TestSet[];
  answers: Record<string, number>;
}

export type ExamSkill = "listening" | "reading" | "writing" | "speaking";

export interface ExamTaskResult {
  kind: Kind;
  taskId: string;
  taskName: string;
  promptTitle: string;
  response: string;
  durationSec?: number;
  /** null when AI scoring wasn't available. */
  level: number | null;
  result: GradeResult;
}

export interface ExamResult {
  mode: "exam";
  source: "builtin" | "ai";
  levels: Record<ExamSkill, number | null>;
  /** Mean of the available skill levels, one decimal. */
  average: number | null;
  listening: ObjectiveResult;
  reading: ObjectiveResult;
  writing: ExamTaskResult[];
  speaking: ExamTaskResult[];
}

export type GradeResult =
  | { mode: "ai"; model: string; feedback: Feedback; checks: Check[] }
  | { mode: "offline"; reason: string; checks: Check[] }
  | ObjectiveResult
  | ExamResult;

/** Lets a writing/speaking session run as one step of the mock exam. */
export interface ExamHooks {
  prompt: Prompt;
  onSubmit: (req: GradeRequest) => void;
}

export interface Attempt {
  id: string;
  createdAt: string;
  kind: Kind | Skill | "exam";
  taskId: string;
  taskName: string;
  promptTitle: string;
  response: string;
  choice?: string;
  wordCount: number;
  durationSec?: number;
  result: GradeResult;
}
