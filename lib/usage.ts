import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { createAdminClient } from "./supabase/admin";

export type UsageKind = "score" | "generate_test" | "generate_prompt";

/** Daily limits per user. Override with environment variables, e.g. SCORING_DAILY_LIMIT=20. */
export const DAILY_LIMITS: Record<UsageKind, number> = {
  score: Number(process.env.SCORING_DAILY_LIMIT) || 15,
  generate_test: Number(process.env.GENERATE_TEST_DAILY_LIMIT) || 3,
  generate_prompt: Number(process.env.GENERATE_PROMPT_DAILY_LIMIT) || 10,
};

/** Limits reset at midnight in this time zone. */
export const LIMIT_TIME_ZONE = "America/Toronto";

// USD per million tokens. Keep in sync with Anthropic's pricing page.
const PRICES: Record<string, { input: number; output: number }> = {
  "claude-opus-5-5": { input: 4, output: 20 },
  "claude-opus-5": { input: 5, output: 25 },
  "claude-sonnet-5-5": { input: 2, output: 10 },
  "claude-sonnet-5": { input: 2, output: 10 },
  "claude-haiku-5-5": { input: 0.1, output: 0.5 },
};

export function costUsd(model: string, usage: Anthropic.Usage) {
  const p = PRICES[model] ?? PRICES["claude-opus-5-5"];
  const input = usage.input_tokens ?? 0;
  const output = usage.output_tokens ?? 0; // includes thinking tokens
  const cacheWrite = usage.cache_creation_input_tokens ?? 0;
  const cacheRead = usage.cache_read_input_tokens ?? 0;
  return (input * p.input + output * p.output + cacheWrite * p.input * 1.25 + cacheRead * p.input * 0.1) / 1_000_000;
}

/** Start of "today" in LIMIT_TIME_ZONE, as a Date. */
export function startOfToday(now = new Date()) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: LIMIT_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(now)
      .map((p) => [p.type, p.value]),
  );
  const y = Number(parts.year), m = Number(parts.month), d = Number(parts.day);
  const localAsUtc = Date.UTC(y, m - 1, d, Number(parts.hour), Number(parts.minute), Number(parts.second));
  const offset = Math.round((localAsUtc - now.getTime()) / 60000) * 60000;
  return new Date(Date.UTC(y, m - 1, d) - offset);
}

export async function usedToday(userId: string, kind: UsageKind) {
  const { count, error } = await createAdminClient()
    .from("ai_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kind", kind)
    .gte("created_at", startOfToday().toISOString());
  if (error) throw new Error(`usage count failed: ${error.message}`);
  return count ?? 0;
}

export type Reservation =
  | { ok: true; id: number; used: number; limit: number }
  | { ok: false; used: number; limit: number };

/**
 * Claim one slot for an AI call before making it. The slot counts towards today's
 * limit straight away, so parallel requests can't slip past the cap: each one is
 * ranked by its row id and anything beyond the limit is rolled back.
 */
export async function reserve(userId: string, kind: UsageKind): Promise<Reservation> {
  const db = createAdminClient();
  const limit = DAILY_LIMITS[kind];
  const since = startOfToday().toISOString();

  // Cheap early exit when the user is clearly over the limit.
  if ((await usedToday(userId, kind)) >= limit) return { ok: false, used: limit, limit };

  const { data: row, error } = await db.from("ai_usage").insert({ user_id: userId, kind }).select("id").single();
  if (error || !row) throw new Error(`usage reserve failed: ${error?.message}`);

  const { count } = await db
    .from("ai_usage")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("kind", kind)
    .gte("created_at", since)
    .lte("id", row.id);
  const rank = count ?? 1;
  if (rank > limit) {
    await db.from("ai_usage").delete().eq("id", row.id);
    return { ok: false, used: limit, limit };
  }
  return { ok: true, id: row.id, used: rank, limit };
}

/** Record the model, tokens and cost once the AI call succeeds. */
export async function complete(id: number, model: string, usage: Anthropic.Usage) {
  const { error } = await createAdminClient()
    .from("ai_usage")
    .update({
      status: "done",
      model,
      input_tokens: (usage.input_tokens ?? 0) + (usage.cache_creation_input_tokens ?? 0) + (usage.cache_read_input_tokens ?? 0),
      output_tokens: usage.output_tokens ?? 0,
      cost_usd: Number(costUsd(model, usage).toFixed(6)),
    })
    .eq("id", id);
  if (error) console.error("[usage] complete failed", error.message);
}

/** Give the slot back when the AI call fails, so errors don't use up the user's quota. */
export async function release(id: number) {
  const { error } = await createAdminClient().from("ai_usage").delete().eq("id", id);
  if (error) console.error("[usage] release failed", error.message);
}

export function limitMessage(kind: UsageKind, limit: number) {
  const what = kind === "score" ? "answer scores" : kind === "generate_test" ? "new tests" : "new prompts";
  return `You've used all ${limit} ${what} for today. Your limit resets at midnight Eastern time.`;
}
