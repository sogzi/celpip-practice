import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod/v4";
import {
  CRITERIA_HELP,
  SPEAKING_CRITERIA,
  WRITING_CRITERIA,
  getSpeakingTask,
  getWritingTask,
  type Prompt,
} from "./celpip";
import { countWords } from "./checks";
import { resolvePrompt } from "./prompts";
import type { Feedback, GradeRequest } from "./types";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

const FeedbackSchema = z.object({
  overallLevel: z.number().describe("Overall CELPIP level, integer 1-12"),
  summary: z.string().describe("2-3 sentence overall assessment addressed to the test taker"),
  dimensions: z
    .array(
      z.object({
        name: z.string().describe("Exactly one of the four CELPIP rating dimensions"),
        level: z.number().describe("CELPIP level for this dimension, integer 1-12"),
        comment: z.string().describe("1-2 sentences justifying the level with specific evidence"),
      }),
    )
    .describe("One entry per rating dimension, in the order given"),
  strengths: z.array(z.string()).describe("2-4 specific strengths"),
  improvements: z.array(z.string()).describe("3-5 concrete, actionable tips to reach the next level"),
  corrections: z
    .array(
      z.object({
        original: z.string().describe("Exact phrase copied from the response"),
        suggestion: z.string().describe("Corrected or upgraded version"),
        explanation: z.string().describe("Short reason: grammar rule, word choice, tone, etc."),
      }),
    )
    .describe("Up to 8 of the most important language fixes"),
  improvedVersion: z
    .string()
    .describe("A rewrite of the full response at CELPIP level 10-11, keeping the test taker's ideas"),
});

function describePrompt(p: Prompt) {
  let s = `${p.title}\n${p.body}`;
  if (p.points) s += "\n" + p.points.map((x) => `- ${x}`).join("\n");
  if (p.options) s += "\n" + p.options.map((o) => `- ${o.label}: ${o.detail}`).join("\n");
  return s;
}

function buildPrompt(req: GradeRequest) {
  const words = countWords(req.response);
  if (req.kind === "writing") {
    const task = getWritingTask(req.taskId)!;
    const prompt = resolvePrompt("writing", req.taskId, req.promptId, req.prompt)!;
    return {
      criteria: WRITING_CRITERIA,
      content: [
        `CELPIP-General Writing Task ${task.number}: ${task.name}`,
        `Time allowed: ${task.minutes} minutes. Target length: ${task.minWords}-${task.maxWords} words.`,
        req.minutesUsed !== undefined ? `Time used: ${req.minutesUsed.toFixed(1)} minutes.` : "",
        `\n<task>\n${describePrompt(prompt)}\n</task>`,
        req.choice ? `\nOption chosen by the test taker: ${req.choice}` : "",
        `\n<response word_count="${words}">\n${req.response}\n</response>`,
      ].join("\n"),
    };
  }
  const task = getSpeakingTask(req.taskId)!;
  const prompt = resolvePrompt("speaking", req.taskId, req.promptId, req.prompt)!;
  const dur = req.durationSec ?? 0;
  return {
    criteria: SPEAKING_CRITERIA,
    content: [
      `CELPIP-General Speaking Task ${task.number}: ${task.name}`,
      `Preparation: ${task.prepSeconds}s. Speaking time allowed: ${task.speakSeconds}s.`,
      `Actually spoke for: ${Math.round(dur)}s (${words} words, ~${dur > 5 ? Math.round((words / dur) * 60) : 0} words/min).`,
      `\n<task>\n${describePrompt(prompt)}\n</task>`,
      req.choice ? `\nOption chosen by the test taker: ${req.choice}` : "",
      `\n<transcript>\n${req.response}\n</transcript>`,
      `\nThis is an automatic speech-to-text transcript, so punctuation and some words may be wrong, and you cannot hear pronunciation or intonation. Judge Listenability from grammar, sentence variety, self-corrections, fillers and pace that are visible in the transcript, and say briefly in that dimension's comment that pronunciation could not be assessed. Do not penalize missing punctuation or obvious transcription errors. The improved version should be a natural spoken answer that fits in ${task.speakSeconds} seconds.`,
    ].join("\n"),
  };
}

function systemPrompt(criteria: readonly string[]) {
  return `You are an experienced, certified CELPIP-General rater. Score the test taker's response the way an official CELPIP rater would, on the 1-12 CELPIP level scale (12 = advanced proficiency, 9 = effective, 7 = adequate, 5 = acquiring, 3 = some proficiency in limited contexts, 1-2 = minimal).

Rate these four dimensions, in this order, using these exact names:
${criteria.map((c) => `- ${c}: ${CRITERIA_HELP[c]}`).join("\n")}

Calibration:
- Be accurate, not generous. Most intermediate learners score 6-8. Reserve 10+ for responses that are fluent, precise, well-organized and fully address every part of the task. Only score 12 if a skilled native-level writer/speaker would be hard pressed to improve it.
- A response that is well under the length/time target, off-topic, or misses required points must lose marks in Task Fulfillment and usually Content/Coherence.
- The overall level reflects the four dimensions together (roughly their average, rounded), not just the best one.
- Quote the response exactly in "original" for corrections. Prioritize errors that most affect the score.
- Write feedback directly to the test taker ("you"), in clear, encouraging, plain English.`;
}

function clampLevel(n: number) {
  return Math.max(1, Math.min(12, Math.round(n)));
}

export async function gradeWithClaude(req: GradeRequest): Promise<{ feedback: Feedback; usage: Anthropic.Usage }> {
  const client = new Anthropic();
  const { criteria, content } = buildPrompt(req);

  const message = await client.messages.parse({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "medium", format: zodOutputFormat(FeedbackSchema) },
    system: systemPrompt(criteria),
    messages: [{ role: "user", content }],
  });

  if (message.stop_reason === "refusal") throw new Error("The model declined to grade this response.");
  if (message.stop_reason === "max_tokens") throw new Error("Grading was cut off before it finished. Please try again.");
  const out = message.parsed_output;
  if (!out) throw new Error("Could not read the grader's response. Please try again.");

  const feedback: Feedback = {
    ...out,
    overallLevel: clampLevel(out.overallLevel),
    dimensions: out.dimensions.map((d) => ({ ...d, level: clampLevel(d.level) })),
  };
  return { feedback, usage: message.usage };
}

export function hasApiKey() {
  return Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);
}

/** Message safe to show users: no provider, model or configuration details. */
export function userMessage(err: unknown): string {
  console.error("[scoring]", explainError(err));
  if (err instanceof Anthropic.RateLimitError) return "Lots of people are practising right now. Please try again in a minute.";
  if (err instanceof Anthropic.APIConnectionError) return "Couldn't reach the scoring service. Check your connection and try again.";
  return "Scoring is temporarily unavailable. Please try again later.";
}

/** Detailed explanation for an API failure (for server logs only). */
export function explainError(err: unknown): string {
  if (err instanceof Anthropic.AuthenticationError)
    return "Your Anthropic API key was rejected. Check ANTHROPIC_API_KEY in .env.local.";
  if (err instanceof Anthropic.PermissionDeniedError)
    return "This API key doesn't have permission to use the model. Check your workspace settings at platform.claude.com.";
  if (err instanceof Anthropic.NotFoundError)
    return `The model "${MODEL}" isn't available to this API key. Set ANTHROPIC_MODEL in .env.local to a model your account can use (e.g. claude-sonnet-5-5).`;
  if (err instanceof Anthropic.RateLimitError)
    return "Rate limited by the Anthropic API — wait a minute and try again.";
  if (err instanceof Anthropic.BadRequestError && /credit/i.test(err.message))
    return "Your Anthropic account is out of credits. Add credits at platform.claude.com.";
  if (err instanceof Anthropic.APIConnectionError)
    return "Couldn't reach the Anthropic API. Check your internet connection.";
  if (err instanceof Anthropic.APIError) return `Anthropic API error (${err.status}): ${err.message}`;
  return err instanceof Error ? err.message : "Unknown grading error.";
}
