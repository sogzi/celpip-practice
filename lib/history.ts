import type { Attempt } from "./types";

const KEY = "celpip-practice:attempts:v1";

export function loadAttempts(): Attempt[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch {
    return [];
  }
}

export function saveAttempt(a: Attempt) {
  let all = [a, ...loadAttempts()].slice(0, 100);
  // Mock exams are large; if storage is full, drop the oldest attempts until it fits.
  while (all.length > 0) {
    try {
      localStorage.setItem(KEY, JSON.stringify(all));
      notify();
      return true;
    } catch {
      if (all.length === 1) break;
      all = all.slice(0, Math.max(1, Math.floor(all.length * 0.8)));
    }
  }
  return false;
}

export function deleteAttempt(id: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify(loadAttempts().filter((a) => a.id !== id)));
    notify();
  } catch {}
}

export function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

// useSyncExternalStore plumbing so components re-render when history changes.
const listeners = new Set<() => void>();
let cachedRaw: string | null | undefined;
let cached: Attempt[] = [];
const EMPTY: Attempt[] = [];

export function subscribe(fn: () => void) {
  listeners.add(fn);
  const onStorage = (e: StorageEvent) => e.key === KEY && fn();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(fn);
    window.removeEventListener("storage", onStorage);
  };
}

export function getSnapshot(): Attempt[] {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(KEY);
  } catch {}
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cached = raw ? JSON.parse(raw) : [];
    } catch {
      cached = [];
    }
  }
  return cached;
}

export function getServerSnapshot() {
  return EMPTY;
}

function notify() {
  listeners.forEach((fn) => fn());
}

/** The headline level of an attempt (mock exams use their average), or null if unscored. */
export function attemptLevel(a: Attempt): number | null {
  switch (a.result.mode) {
    case "ai":
      return a.result.feedback.overallLevel;
    case "objective":
      return a.result.level;
    case "exam":
      return a.result.average;
    default:
      return null;
  }
}
