import { connection } from "next/server";
import { MODEL, hasApiKey } from "@/lib/grader";

/** Reads env at request time so adding a key doesn't require a rebuild. */
export async function ApiBadge() {
  await connection();
  const aiReady = hasApiKey();
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ${
        aiReady ? "bg-good-soft text-good" : "bg-warn-soft text-warn"
      }`}
    >
      <span className={`size-1.5 rounded-full ${aiReady ? "bg-good" : "bg-warn"}`} aria-hidden />
      {aiReady ? `AI scoring on · ${MODEL}` : "AI scoring off — add ANTHROPIC_API_KEY to .env.local"}
    </div>
  );
}
