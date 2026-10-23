import { resolvePrompt } from "@/lib/prompts";
import { createClient } from "@/lib/supabase/server";
import { countWords, runChecks } from "@/lib/checks";
import { MODEL, gradeWithClaude, hasApiKey, userMessage } from "@/lib/grader";
import type { GradeRequest, GradeResult } from "@/lib/types";
import { complete, limitMessage, release, reserve } from "@/lib/usage";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return Response.json({ error: "Please log in to continue." }, { status: 401 });

  let req: GradeRequest;
  try {
    req = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if ((req.kind !== "writing" && req.kind !== "speaking") || !resolvePrompt(req.kind, req.taskId, req.promptId, req.prompt)) {
    return Response.json({ error: "Unknown task or prompt." }, { status: 400 });
  }
  if (typeof req.response !== "string" || countWords(req.response) < 10) {
    return Response.json({ error: "Your response is too short to grade (minimum 10 words)." }, { status: 400 });
  }
  if (req.response.length > 20000) {
    return Response.json({ error: "Response is too long." }, { status: 400 });
  }

  const checks = runChecks(req);

  if (!hasApiKey()) {
    const result: GradeResult = {
      mode: "offline",
      reason: "Scoring is temporarily unavailable, so only the automatic checks ran. Please try again later.",
      checks,
    };
    return Response.json(result);
  }

  // Daily limit: claim a slot before calling the AI; give it back if scoring fails.
  const userId = auth.claims.sub;
  const slot = await reserve(userId, "score");
  if (!slot.ok) {
    return Response.json({ error: limitMessage("score", slot.limit), quota: { used: slot.used, limit: slot.limit } }, { status: 429 });
  }

  try {
    const { feedback, usage } = await gradeWithClaude(req);
    await complete(slot.id, MODEL, usage);
    const result: GradeResult = { mode: "ai", model: MODEL, feedback, checks };
    return Response.json({ ...result, quota: { used: slot.used, limit: slot.limit } });
  } catch (err) {
    console.error("[grade]", err);
    await release(slot.id);
    const result: GradeResult = { mode: "offline", reason: userMessage(err), checks };
    return Response.json(result);
  }
}
