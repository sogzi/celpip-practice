import type { Kind } from "./celpip";
import type { Skill, TestSet } from "./rl";

export interface GradeRequest {
  kind: Kind | Skill;
  taskId: string;
  promptId: string;
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

export type GradeResult =
  | { mode: "ai"; model: string; feedback: Feedback; checks: Check[] }
  | { mode: "offline"; reason: string; checks: Check[] }
  | ObjectiveResult;

export interface Attempt {
  id: string;
  createdAt: string;
  kind: Kind | Skill;
  taskId: string;
  taskName: string;
  promptTitle: string;
  response: string;
  choice?: string;
  wordCount: number;
  durationSec?: number;
  result: GradeResult;
}
