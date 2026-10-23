"use client";
import { useEffect, useSyncExternalStore } from "react";

type Quota = { used: number; limit: number } | null;
let quota: Quota = null;
let fetching = false;
const listeners = new Set<() => void>();

function set(q: Quota) {
  quota = q;
  listeners.forEach((fn) => fn());
}

async function refresh() {
  if (fetching) return;
  fetching = true;
  try {
    const res = await fetch("/api/usage", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      set({ used: data.score.used, limit: data.score.limit });
    }
  } finally {
    fetching = false;
  }
}

/** Call with the `quota` field from a /api/grade response to update the counter instantly. */
export function updateQuota(q: { used: number; limit: number } | undefined) {
  if (q) set(q);
}

/** "12 of 15 scores left today": shown next to the submit button. */
export function ScoreQuota({ className = "" }: { className?: string }) {
  const q = useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => quota,
    () => null,
  );
  useEffect(() => {
    void refresh();
  }, []);
  if (!q) return null;
  const left = Math.max(0, q.limit - q.used);
  return (
    <p className={`text-xs tabular-nums ${left === 0 ? "text-accent" : left <= 3 ? "text-warn" : "text-muted"} ${className}`}>
      {left === 0 ? "No scores left today. Your limit resets at midnight Eastern time." : `${left} of ${q.limit} scores left today`}
    </p>
  );
}
