import { resolvePrompt } from "@/lib/prompts";
import { countWords, runChecks } from "@/lib/checks";
import { MODEL, explainError, gradeWithClaude, hasApiKey } from "@/lib/grader";
import type { GradeRequest, GradeResult } from "@/lib/types";

export async function POST(request: Request) {
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
      reason: "AI scoring isn't set up on this server yet (no Anthropic API key), so only the automatic checks ran.",
      checks,
    };
    return Response.json(result);
  }

  try {
    const feedback = await gradeWithClaude(req);
    const result: GradeResult = { mode: "ai", model: MODEL, feedback, checks };
    return Response.json(result);
  } catch (err) {
    console.error("[grade]", err);
    const result: GradeResult = { mode: "offline", reason: explainError(err), checks };
    return Response.json(result);
  }
}
