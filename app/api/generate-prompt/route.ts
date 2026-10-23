import type { Kind } from "@/lib/celpip";
import { FEATURES } from "@/lib/features";
import { MODEL, hasApiKey, userMessage } from "@/lib/grader";
import { createClient } from "@/lib/supabase/server";
import { complete, limitMessage, release, reserve } from "@/lib/usage";
import { generatePrompt } from "@/lib/prompt-generator";
import { getTask } from "@/lib/prompts";

export async function POST(request: Request) {
  if (!FEATURES.aiGeneration) {
    return Response.json({ error: "This feature is coming soon." }, { status: 403 });
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
    return Response.json({ error: "New prompts can't be generated right now." }, { status: 503 });
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return Response.json({ error: "Please log in to continue." }, { status: 401 });
  const slot = await reserve(auth.claims.sub, "generate_prompt");
  if (!slot.ok) return Response.json({ error: limitMessage("generate_prompt", slot.limit) }, { status: 429 });

  try {
    const { prompt, usage } = await generatePrompt(kind, taskId, avoid);
    await complete(slot.id, MODEL, usage);
    return Response.json(prompt);
  } catch (err) {
    await release(slot.id);
    console.error("[generate-prompt]", err);
    return Response.json({ error: userMessage(err) }, { status: 502 });
  }
}
