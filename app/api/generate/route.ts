import { FEATURES } from "@/lib/features";
import { MODEL, hasApiKey, userMessage } from "@/lib/grader";
import { createClient } from "@/lib/supabase/server";
import { complete, limitMessage, release, reserve } from "@/lib/usage";
import { generateSet } from "@/lib/generator";
import { getPart, type Skill } from "@/lib/rl";

export async function POST(request: Request) {
  if (!FEATURES.aiGeneration) {
    return Response.json({ error: "This feature is coming soon." }, { status: 403 });
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
      { error: "New tests can't be generated right now. Please use the built-in test." },
      { status: 503 },
    );
  }
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return Response.json({ error: "Please log in to continue." }, { status: 401 });
  const slot = await reserve(auth.claims.sub, "generate_test");
  if (!slot.ok) return Response.json({ error: limitMessage("generate_test", slot.limit) }, { status: 429 });

  try {
    const { set, usage } = await generateSet(skill, partId);
    await complete(slot.id, MODEL, usage);
    return Response.json(set);
  } catch (err) {
    await release(slot.id);
    console.error("[generate]", err);
    return Response.json({ error: userMessage(err) }, { status: 502 });
  }
}
