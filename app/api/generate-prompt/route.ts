import type { Kind } from "@/lib/celpip";
import { FEATURES } from "@/lib/features";
import { explainError, hasApiKey } from "@/lib/grader";
import { generatePrompt } from "@/lib/prompt-generator";
import { getTask } from "@/lib/prompts";

export async function POST(request: Request) {
  if (!FEATURES.aiGeneration) {
    return Response.json({ error: "AI-generated content is coming soon." }, { status: 403 });
  }
  let body: { kind?: Kind; taskId?: string; avoid?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { kind, taskId } = body;
  if ((kind !== "writing" && kind !== "speaking") || !taskId || !getTask(kind, taskId)) {
    return Response.json({ error: "Unknown task." }, { status: 400 });
  }
  const avoid = Array.isArray(body.avoid)
    ? body.avoid.filter((s): s is string => typeof s === "string").map((s) => s.slice(0, 120)).slice(0, 20)
    : [];
  if (!hasApiKey()) {
    return Response.json({ error: "AI generation isn't set up on this server yet (no Anthropic API key)." }, { status: 503 });
  }
  try {
    return Response.json(await generatePrompt(kind, taskId, avoid));
  } catch (err) {
    console.error("[generate-prompt]", err);
    return Response.json({ error: explainError(err) }, { status: 502 });
  }
}
