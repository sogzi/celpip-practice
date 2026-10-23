import { createClient } from "@/lib/supabase/server";
import { DAILY_LIMITS, startOfToday, usedToday } from "@/lib/usage";

/** How many answer scores the signed-in user has left today. */
export async function GET() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) return Response.json({ error: "Please log in to continue." }, { status: 401 });
  const used = await usedToday(auth.claims.sub, "score");
  const limit = DAILY_LIMITS.score;
  return Response.json(
    {
      score: { used: Math.min(used, limit), limit, left: Math.max(0, limit - used) },
      resetsAt: new Date(startOfToday().getTime() + 24 * 3600 * 1000).toISOString(),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
