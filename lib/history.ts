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
  try {
    const all = [a, ...loadAttempts()].slice(0, 100);
    localStorage.setItem(KEY, JSON.stringify(all));
    notify();
  } catch {
    /* storage full or unavailable: history is best-effort */
  }
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
