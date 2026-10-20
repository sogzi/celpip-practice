// Prompt lookup shared by the client and the grading API. A prompt is either one of
// the built-in prompts in celpip.ts or an AI-generated one ("ai-…") sent by the client.
import { getSpeakingTask, getWritingTask, type Kind, type Prompt } from "./celpip";

export function getTask(kind: Kind, taskId: string) {
  return kind === "writing" ? getWritingTask(taskId) : getSpeakingTask(taskId);
}

const str = (v: unknown, max: number) => typeof v === "string" && v.trim().length > 0 && v.length <= max;

/** Checks the shape of a client-supplied generated prompt. */
export function isValidCustomPrompt(p: unknown): p is Prompt {
  if (!p || typeof p !== "object") return false;
  const x = p as Record<string, unknown>;
  if (!str(x.id, 80) || !(x.id as string).startsWith("ai-")) return false;
  if (!str(x.title, 120) || !str(x.body, 1500)) return false;
  if (x.points !== undefined && !(Array.isArray(x.points) && x.points.length <= 8 && x.points.every((s) => str(s, 300)))) return false;
  if (x.options !== undefined) {
    if (!Array.isArray(x.options) || x.options.length !== 2) return false;
    for (const o of x.options as { label?: unknown; detail?: unknown }[]) {
      if (!o || typeof o !== "object" || !str(o.label, 120) || !str(o.detail, 300)) return false;
    }
  }
  return true;
}

/** Returns the prompt being answered, or undefined if it's unknown or malformed. */
export function resolvePrompt(kind: Kind, taskId: string, promptId: string, custom?: unknown): Prompt | undefined {
  const task = getTask(kind, taskId);
  if (!task) return undefined;
  const builtin = task.prompts.find((p) => p.id === promptId);
  if (builtin) return builtin;
  if (isValidCustomPrompt(custom) && custom.id === promptId) return custom;
  return undefined;
}
