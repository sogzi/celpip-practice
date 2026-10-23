import { FEATURES } from "@/lib/features";
import { explainError, hasApiKey } from "@/lib/grader";
import { generateSet } from "@/lib/generator";
import { getPart, type Skill } from "@/lib/rl";

export async function POST(request: Request) {
  if (!FEATURES.aiGeneration) {
    return Response.json({ error: "AI-generated content is coming soon." }, { status: 403 });
  }
  let body: { skill?: Skill; partId?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { skill, partId } = body;
  if ((skill !== "reading" && skill !== "listening") || !partId || !getPart(skill, partId)) {
    return Response.json({ error: "Unknown skill or part." }, { status: 400 });
  }
  if (!hasApiKey()) {
    return Response.json(
      { error: "AI generation isn't set up on this server yet (no Anthropic API key). Use the built-in test instead." },
      { status: 503 },
    );
  }
  try {
    return Response.json(await generateSet(skill, partId));
  } catch (err) {
    console.error("[generate]", err);
    return Response.json({ error: explainError(err) }, { status: 502 });
  }
}
