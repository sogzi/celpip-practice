"use client";
import type { Prompt } from "@/lib/celpip";

export function PromptPicker({
  prompts,
  value,
  onChange,
  disabled,
  onGenerate,
  generating,
  error,
}: {
  prompts: Prompt[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
  onGenerate?: () => void;
  generating?: boolean;
  error?: string;
}) {
  const idx = prompts.findIndex((p) => p.id === value);
  let builtinNo = 0;
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <label htmlFor="prompt" className="sr-only">Prompt</label>
        <select
          id="prompt"
          value={value}
          disabled={disabled || generating}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 sm:flex-none sm:max-w-sm rounded-lg border border-line bg-surface px-3 py-2 text-sm disabled:opacity-50"
        >
          {prompts.map((p) => (
            <option key={p.id} value={p.id}>
              {p.id.startsWith("ai-") ? `✦ New: ${p.title}` : `Prompt ${++builtinNo}: ${p.title}`}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={disabled || generating}
          onClick={() => onChange(prompts[(idx + 1) % prompts.length].id)}
          className="shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm hover:bg-surface-2 disabled:opacity-50"
        >
          Next prompt
        </button>
        {onGenerate && (
          <button
            type="button"
            disabled={disabled || generating}
            onClick={onGenerate}
            className="shrink-0 inline-flex items-center gap-2 rounded-lg border border-accent/40 bg-accent-soft text-accent px-3 py-2 text-sm font-medium hover:border-accent disabled:opacity-50"
          >
            {generating && <span className="size-3.5 rounded-full border-2 border-accent/30 border-t-accent animate-spin" aria-hidden />}
            {generating ? "Writing a new prompt…" : "✦ Generate new prompt"}
          </button>
        )}
      </div>
      {error && <p className="text-sm text-accent">{error}</p>}
    </div>
  );
}
