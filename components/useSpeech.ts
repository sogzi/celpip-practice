"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { TestSet } from "@/lib/rl";

type Line = { speaker: string; text: string };
type Speakers = NonNullable<TestSet["speakers"]>;

// --- voice list as an external store (voices load asynchronously) -----------
let cachedKey = "";
let cachedVoices: SpeechSynthesisVoice[] = [];
const EMPTY: SpeechSynthesisVoice[] = [];

function subscribeVoices(cb: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return () => {};
  speechSynthesis.addEventListener("voiceschanged", cb);
  return () => speechSynthesis.removeEventListener("voiceschanged", cb);
}

function getVoices() {
  if (!("speechSynthesis" in window)) return EMPTY;
  const list = speechSynthesis.getVoices();
  const key = list.map((v) => v.voiceURI).join("|");
  if (key !== cachedKey) {
    cachedKey = key;
    cachedVoices = list;
  }
  return cachedVoices;
}

const noop = () => () => {};

// --- voice casting ----------------------------------------------------------
const FEMALE = /samantha|karen|moira|tessa|victoria|fiona|serena|zira|susan|allison|ava|kate|nicky|joelle|female|catherine|sandy|shelley|flo|aria|jenny|libby|sonia|natasha|clara|amelie/i;
const MALE = /daniel|alex|tom|aaron|arthur|gordon|oliver|rishi|david|mark|male|guy|ryan|liam|thomas|james|george|lee/i;
const LANG_RANK = ["en-CA", "en-US", "en-GB", "en-AU", "en-IE", "en-NZ"];
// Novelty and old formant voices sound robotic; only use them if nothing else exists.
const ROBOTIC = /albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley/i;
// Downloaded "enhanced"/"premium" system voices sound more natural than the defaults.
const NATURAL = /premium|enhanced|natural|neural/i;

function rankLang(v: SpeechSynthesisVoice) {
  const i = LANG_RANK.indexOf(v.lang.replace("_", "-"));
  return i === -1 ? LANG_RANK.length : i;
}

// Installed voices first: network voices (Chrome's "Google …", Edge's "… Online") can be slow
// to start or never start at all, which makes playback fail.
function rankQuality(v: SpeechSynthesisVoice) {
  return (ROBOTIC.test(v.name) ? 4 : 0) + (v.localService ? 0 : 2) + (NATURAL.test(v.name) ? 0 : 1);
}

// Default browser voices speak at ~180-190 words per minute; CELPIP recordings are a
// relaxed conversational ~140-150, with clear pauses between sentences and speakers.
const RATE = 0.8;
const SENTENCE_PAUSE_MS = 300;
const TURN_PAUSE_MS = 700;

export interface Cast {
  voice: SpeechSynthesisVoice | null;
  pitch: number;
}

export function castVoices(voices: SpeechSynthesisVoice[], speakers: Speakers, localOnly = false): Map<string, Cast> {
  const english = voices
    .filter((v) => /^en([-_]|$)/i.test(v.lang) && (!localOnly || v.localService))
    .sort((a, b) => rankQuality(a) - rankQuality(b) || rankLang(a) - rankLang(b));
  const used = new Set<string>();
  const cast = new Map<string, Cast>();
  speakers.forEach((s, i) => {
    const pattern = s.voice === "female" ? FEMALE : MALE;
    const other = s.voice === "female" ? MALE : FEMALE;
    const pick =
      english.find((v) => !used.has(v.voiceURI) && pattern.test(v.name) && !other.test(v.name)) ||
      english.find((v) => !used.has(v.voiceURI) && !other.test(v.name)) ||
      english.find((v) => !used.has(v.voiceURI)) ||
      english[0] ||
      null;
    if (pick) used.add(pick.voiceURI);
    // If we had to reuse a voice, vary pitch so speakers still sound different.
    const reused = cast.size > 0 && [...cast.values()].some((c) => c.voice?.voiceURI === pick?.voiceURI);
    const pitch = reused ? (s.voice === "female" ? 1.2 : 0.8) + (i % 2) * 0.05 : 1;
    cast.set(s.name, { voice: pick, pitch: pick ? pitch : s.voice === "female" ? 1.15 : 0.85 });
  });
  return cast;
}

function sentences(text: string) {
  return text.match(/[^.!?]+[.!?]+["”']?\s*|[^.!?]+$/g)?.map((s) => s.trim()).filter(Boolean) ?? [text];
}

/** Plays a listening script with one voice per speaker. */
export function useSpeech() {
  const supported = useSyncExternalStore(noop, () => "speechSynthesis" in window, () => false);
  const voices = useSyncExternalStore(subscribeVoices, getVoices, () => EMPTY);
  const [speaking, setSpeaking] = useState<string | null>(null);
  const runRef = useRef(0);

  const stop = useCallback(() => {
    runRef.current++;
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    setSpeaking(null);
  }, []);

  const play = useCallback(
    (script: Line[], speakers: Speakers, onEnd?: () => void, onFail?: () => void) => {
      if (!("speechSynthesis" in window)) return onFail?.();
      speechSynthesis.cancel();
      const run = ++runRef.current;
      const queue = script.flatMap((line, li) =>
        sentences(line.text).map((text, si) => ({ speaker: line.speaker, text, pause: si > 0 ? SENTENCE_PAUSE_MS : li > 0 ? TURN_PAUSE_MS : 0 })),
      );
      let cast: Map<string, Cast>;
      let retried = false;
      let watchdog: ReturnType<typeof setTimeout> | undefined;
      let i = 0;
      let current = 0; // id of the utterance whose events we still listen to

      const fail = () => {
        runRef.current++;
        clearTimeout(watchdog);
        speechSynthesis.cancel();
        setSpeaking(null);
        onFail?.();
      };

      const next = () => {
        if (run !== runRef.current) return;
        if (i >= queue.length) {
          setSpeaking(null);
          onEnd?.();
          return;
        }
        const item = queue[i++];
        const id = ++current;
        const c = cast.get(item.speaker);
        const u = new SpeechSynthesisUtterance(item.text);
        if (c?.voice) {
          u.voice = c.voice;
          u.lang = c.voice.lang;
        } else {
          u.lang = "en-CA";
        }
        u.pitch = c?.pitch ?? 1;
        u.rate = RATE;
        u.onstart = () => clearTimeout(watchdog);
        u.onend = () => id === current && next();
        u.onerror = (e) => {
          if (id === current && e.error !== "interrupted" && e.error !== "canceled") next();
        };
        const start = () => {
          if (run !== runRef.current || id !== current) return;
          setSpeaking(item.speaker);
          speechSynthesis.speak(u);
          clearTimeout(watchdog);
          watchdog = setTimeout(() => {
            if (run !== runRef.current || id !== current) return;
            // The voice never started: retry once with installed voices only, then show the transcript.
            const local = castVoices(speechSynthesis.getVoices(), speakers, true);
            if (retried || ![...local.values()].some((l) => l.voice)) return fail();
            retried = true;
            cast = local;
            current++;
            speechSynthesis.cancel();
            i--;
            next();
          }, 5000);
        };
        // Natural pauses between sentences and longer ones when the speaker changes.
        if (item.pause) setTimeout(start, item.pause);
        else start();
      };

      const begin = () => {
        cast = castVoices(speechSynthesis.getVoices(), speakers);
        next();
      };

      if (speechSynthesis.getVoices().length > 0) return begin();
      // Voices load asynchronously (especially in Chrome); give them a moment before giving up.
      let waited = 0;
      const wait = setInterval(() => {
        if (run !== runRef.current) return clearInterval(wait);
        waited += 100;
        if (speechSynthesis.getVoices().length > 0) {
          clearInterval(wait);
          begin();
        } else if (waited >= 3000) {
          clearInterval(wait);
          fail();
        }
      }, 100);
    },
    [],
  );

  useEffect(() => stop, [stop]);

  return { supported, hasVoices: voices.length > 0, speaking, play, stop };
}
