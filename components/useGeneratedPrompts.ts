"use client";
import { useState } from "react";
import type { Kind, Prompt } from "@/lib/celpip";

/** Built-in prompts plus any AI-generated ones created during this visit (newest first). */
export function useGeneratedPrompts(kind: Kind, taskId: string, builtin: Prompt[]) {
  const [generated, setGenerated] = useState<Prompt[]>([]);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string>();

  async function generate(): Promise<Prompt | undefined> {
    setGenerating(true);
    setError(undefined);
    try {
      const res = await fetch("/api/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, taskId, avoid: generated.map((p) => p.title) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't generate a prompt.");
      setGenerated((g) => [data as Prompt, ...g]);
      return data as Prompt;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't generate a prompt.");
    } finally {
      setGenerating(false);
    }
  }

  return { prompts: [...generated, ...builtin], generate, generating, error };
}
