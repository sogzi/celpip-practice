// Helpers for writing built-in Reading & Listening questions.
// Question ids are reassigned per set in rl-bank.ts, so the ids here are placeholders.
import type { Question } from "./rl";

/** Multiple-choice question; the first option is the correct one. */
export function q(prompt: string, correct: string, distractors: string[], explanation?: string): Question {
  return { id: "", prompt, options: [correct, ...distractors], answer: 0, explanation };
}

const PARAGRAPHS = ["A", "B", "C", "D", "E (Not given)"];
/** Reading Part 3 statement; `para` is A–E. */
export function p(prompt: string, para: "A" | "B" | "C" | "D" | "E", explanation?: string): Question {
  return { id: "", prompt, options: PARAGRAPHS, answer: "ABCDE".indexOf(para), explanation };
}
