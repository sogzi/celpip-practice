// Objective, rule-based checks that run with or without the Claude API.
// These never produce a CELPIP level: they only report measurable facts.
import { getSpeakingTask, getWritingTask } from "./celpip";
import type { Check, GradeRequest } from "./types";

const FILLERS = ["um", "uh", "er", "erm", "like", "you know", "i mean", "basically", "actually", "kind of", "sort of"];
const CONNECTORS = [
  "first", "second", "finally", "however", "therefore", "moreover", "furthermore", "in addition",
  "for example", "for instance", "as a result", "on the other hand", "in conclusion", "because",
  "although", "also", "besides", "consequently", "overall", "to sum up", "while",
];

export function countWords(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function countPhrase(text: string, phrase: string) {
  const re = new RegExp(`\\b${phrase.replace(/ /g, "\\s+")}\\b`, "gi");
  return (text.match(re) || []).length;
}

function topRepeated(text: string) {
  const stop = new Set(
    "the a an and or but to of in on at for with is are was were be been it this that i you he she we they my your our their me him her them as so if not have has had do does did will would can could should there here from by about very really just".split(" "),
  );
  const counts = new Map<string, number>();
  for (const w of text.toLowerCase().match(/[a-z']+/g) || []) {
    if (w.length < 4 || stop.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()].filter(([, n]) => n >= 4).sort((a, b) => b[1] - a[1]).slice(0, 3);
}

export function runChecks(req: GradeRequest): Check[] {
  const text = req.response;
  const words = countWords(text);
  const checks: Check[] = [];
  const connectors = CONNECTORS.filter((c) => countPhrase(text, c) > 0);
  const repeated = topRepeated(text);

  if (req.kind === "writing") {
    const task = getWritingTask(req.taskId);
    if (!task) return checks;
    checks.push({
      label: "Length",
      ok: words >= task.minWords && words <= task.maxWords,
      detail: `${words} words (target ${task.minWords}–${task.maxWords}).`,
    });
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim()).length;
    checks.push({
      label: "Paragraphing",
      ok: paragraphs >= 3,
      detail: `${paragraphs} paragraph${paragraphs === 1 ? "" : "s"}. Aim for an opening, 2–3 body paragraphs and a closing.`,
    });
    if (task.number === 1) {
      const greeting = /^\s*(dear|hello|hi|good (morning|afternoon|evening)|to whom)/i.test(text);
      const closing = /(sincerely|regards|best|thank you|thanks|cheers|yours)[^\n]*\n+\s*\S+\s*$/i.test(text.trim());
      checks.push({ label: "Greeting", ok: greeting, detail: greeting ? "Email opens with a greeting." : "Start with a greeting such as “Dear Ms. Chen,”." });
      checks.push({ label: "Sign-off", ok: closing, detail: closing ? "Email ends with a closing and your name." : "End with a closing (e.g. “Best regards,”) followed by your name." });
    } else {
      const stated = req.choice ? text.toLowerCase().includes(req.choice.toLowerCase()) || /\b(i (prefer|choose|support|believe|think)|option [ab])\b/i.test(text) : false;
      checks.push({ label: "Clear position", ok: !!req.choice && stated, detail: req.choice ? (stated ? `You chose ${req.choice} and stated a position.` : "State your choice clearly in the first sentence.") : "Pick Option A or B before writing." });
    }
    if (req.minutesUsed !== undefined) {
      checks.push({ label: "Time", ok: req.minutesUsed <= task.minutes, detail: `${req.minutesUsed.toFixed(1)} of ${task.minutes} minutes used.` });
    }
  } else {
    const task = getSpeakingTask(req.taskId);
    if (!task) return checks;
    const dur = req.durationSec ?? 0;
    const wpm = dur > 5 ? Math.round((words / dur) * 60) : 0;
    checks.push({
      label: "Time used",
      ok: dur >= task.speakSeconds * 0.8,
      detail: `Spoke for ${Math.round(dur)}s of ${task.speakSeconds}s. Try to use at least 80% of the time.`,
    });
    if (wpm) {
      checks.push({ label: "Pace", ok: wpm >= 100 && wpm <= 170, detail: `~${wpm} words per minute (comfortable range is about 110–160).` });
    }
    const fillers = FILLERS.reduce((n, f) => n + countPhrase(text, f), 0);
    checks.push({ label: "Filler words", ok: fillers <= Math.max(3, words / 40), detail: `${fillers} filler word${fillers === 1 ? "" : "s"} (um, uh, like, you know…) detected in the transcript.` });
    if (req.choice !== undefined) {
      checks.push({ label: "Choice made", ok: !!req.choice, detail: req.choice ? `You chose: ${req.choice}.` : "Choose an option during preparation." });
    }
  }

  checks.push({
    label: "Linking words",
    ok: connectors.length >= 3,
    detail: connectors.length ? `Used: ${connectors.slice(0, 6).join(", ")}.` : "No linking words found — try “for example”, “however”, “as a result”.",
  });
  if (repeated.length) {
    checks.push({ label: "Word repetition", ok: false, detail: `Repeated often: ${repeated.map(([w, n]) => `“${w}” ×${n}`).join(", ")}. Use synonyms.` });
  }
  return checks;
}
