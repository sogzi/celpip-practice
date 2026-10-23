// Practice history, stored in the user's account (Supabase table practice_attempts).
//
// - Saving is optimistic: the attempt shows up immediately, is cached in this
//   browser, and is queued until the upload succeeds (retried on the next visit).
// - History saved in this browser before accounts existed is imported once.
// - Caches are per user, so a shared computer never shows someone else's history.
import { createClient } from "./supabase/client";
import type { Attempt } from "./types";

const LEGACY_KEY = "celpip-practice:attempts:v1";
const cacheKey = (uid: string) => `celpip-practice:attempts:v2:${uid}`;
const pendingKey = (uid: string) => `celpip-practice:attempts-pending:v2:${uid}`;
const MAX = 200;

export interface HistorySnapshot {
  attempts: Attempt[];
  /** False until we know who is signed in and have loaded their history (at least from cache). */
  ready: boolean;
}

const EMPTY: HistorySnapshot = { attempts: [], ready: false };
let snapshot: HistorySnapshot = EMPTY;
let currentUser: string | null | undefined;
let loading: Promise<void> | null = null;
let listeningToAuth = false;
const listeners = new Set<() => void>();

function set(attempts: Attempt[], ready = true) {
  snapshot = { attempts, ready };
  listeners.forEach((fn) => fn());
}

// --- local storage helpers ----------------------------------------------------

function read(key: string): Attempt[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Attempt[]) : [];
  } catch {
    return [];
  }
}

/** Write a list, dropping the oldest entries if storage is full (mock exams are large). */
function write(key: string, list: Attempt[]) {
  let items = list;
  while (true) {
    try {
      if (items.length) localStorage.setItem(key, JSON.stringify(items));
      else localStorage.removeItem(key);
      return;
    } catch {
      if (items.length <= 1) return;
      items = items.slice(0, Math.max(1, Math.floor(items.length * 0.8)));
    }
  }
}

function dedupeSorted(list: Attempt[]) {
  const seen = new Set<string>();
  return list
    .filter((a) => (seen.has(a.id) ? false : (seen.add(a.id), true)))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, MAX);
}

function toRow(a: Attempt, userId: string) {
  const level = attemptLevel(a);
  return {
    user_id: userId,
    id: a.id,
    kind: a.kind,
    task_id: a.taskId.slice(0, 64),
    task_name: a.taskName.slice(0, 200),
    prompt_title: a.promptTitle?.slice(0, 300) ?? null,
    level: level === null ? null : Math.min(12, Math.max(0, Math.round(level * 10) / 10)),
    data: a,
    created_at: a.createdAt,
  };
}

// --- loading --------------------------------------------------------------------

async function load() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth.user?.id ?? null;
  currentUser = uid;
  if (!uid) return set([]);

  const cached = read(cacheKey(uid));
  set(cached);

  // Upload anything that hasn't reached the account yet: failed saves and pre-account history.
  const legacy = read(LEGACY_KEY);
  const pending = dedupeSorted([...read(pendingKey(uid)), ...legacy]);
  if (pending.length) {
    const { error } = await supabase.from("practice_attempts").upsert(pending.map((a) => toRow(a, uid)), {
      onConflict: "user_id,id",
      ignoreDuplicates: true,
    });
    if (error) {
      console.error("[history] upload failed", error.message);
    } else {
      write(pendingKey(uid), []);
      if (legacy.length) write(LEGACY_KEY, []);
    }
  }

  const { data: rows, error } = await supabase
    .from("practice_attempts")
    .select("data")
    .order("created_at", { ascending: false })
    .limit(MAX);
  if (currentUser !== uid) return; // signed out or switched account while loading
  if (error) {
    console.error("[history] load failed", error.message);
    // Keep showing the cache plus anything still waiting to upload.
    return set(dedupeSorted([...read(pendingKey(uid)), ...legacy, ...cached]));
  }
  const merged = dedupeSorted([...read(pendingKey(uid)), ...rows.map((r) => r.data as Attempt)]);
  write(cacheKey(uid), merged);
  set(merged);
}

function ensureLoaded() {
  if (!listeningToAuth) {
    listeningToAuth = true;
    createClient().auth.onAuthStateChange((_event, session) => {
      const uid = session?.user.id ?? null;
      if (currentUser !== undefined && uid !== currentUser) {
        currentUser = undefined;
        snapshot = EMPTY;
        loading = load();
      }
    });
  }
  if (!loading) loading = load();
}

// --- public API -----------------------------------------------------------------

export function subscribe(fn: () => void) {
  listeners.add(fn);
  ensureLoaded();
  return () => {
    listeners.delete(fn);
  };
}

export function getSnapshot() {
  return snapshot;
}

export function getServerSnapshot() {
  return EMPTY;
}

/** Save a finished attempt. Shows immediately; uploads in the background. */
export function saveAttempt(a: Attempt) {
  set(dedupeSorted([a, ...snapshot.attempts]), snapshot.ready);
  void (async () => {
    const supabase = createClient();
    const uid = currentUser ?? (await supabase.auth.getUser()).data.user?.id;
    if (!uid) return;
    write(cacheKey(uid), dedupeSorted([a, ...read(cacheKey(uid))]));
    write(pendingKey(uid), dedupeSorted([a, ...read(pendingKey(uid))]));
    const { error } = await supabase.from("practice_attempts").insert(toRow(a, uid));
    if (error && error.code !== "23505") {
      console.error("[history] save failed; will retry on next visit", error.message);
      return;
    }
    write(pendingKey(uid), read(pendingKey(uid)).filter((p) => p.id !== a.id));
  })();
  return true;
}

export function deleteAttempt(id: string) {
  set(snapshot.attempts.filter((a) => a.id !== id), snapshot.ready);
  const uid = currentUser;
  if (!uid) return;
  write(cacheKey(uid), read(cacheKey(uid)).filter((a) => a.id !== id));
  write(pendingKey(uid), read(pendingKey(uid)).filter((a) => a.id !== id));
  void createClient()
    .from("practice_attempts")
    .delete()
    .eq("id", id)
    .then(({ error }) => error && console.error("[history] delete failed", error.message));
}

export function newId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
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
