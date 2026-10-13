"use client";
import type { Prompt } from "@/lib/celpip";

export function PromptPicker({
  prompts,
  value,
  onChange,
  disabled,
}: {
  prompts: Prompt[];
  value: string;
  onChange: (id: string) => void;
  disabled?: boolean;
}) {
  const idx = prompts.findIndex((p) => p.id === value);
  return (
    <div className="flex items-center gap-2">
      <label htmlFor="prompt" className="sr-only">Prompt</label>
      <select
        id="prompt"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-0 flex-1 sm:flex-none rounded-lg border border-line bg-surface px-3 py-2 text-sm disabled:opacity-50"
      >
        {prompts.map((p, i) => (
          <option key={p.id} value={p.id}>
            Prompt {i + 1}: {p.title}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(prompts[(idx + 1) % prompts.length].id)}
        className="shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-sm hover:bg-surface-2 disabled:opacity-50"
      >
        Next prompt
      </button>
    </div>
  );
}
