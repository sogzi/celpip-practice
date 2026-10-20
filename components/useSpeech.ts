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
const MALE = /daniel|alex|fred|tom|aaron|arthur|gordon|oliver|rishi|david|mark|male|guy|ryan|liam|eddy|reed|rocko|grandpa|thomas|james|george|lee/i;
const LANG_RANK = ["en-CA", "en-US", "en-GB", "en-AU", "en-IE", "en-NZ"];

function rankLang(v: SpeechSynthesisVoice) {
  const i = LANG_RANK.indexOf(v.lang.replace("_", "-"));
  return i === -1 ? LANG_RANK.length : i;
}

export interface Cast {
  voice: SpeechSynthesisVoice | null;
  pitch: number;
}

export function castVoices(voices: SpeechSynthesisVoice[], speakers: Speakers): Map<string, Cast> {
  const english = voices
    .filter((v) => /^en([-_]|$)/i.test(v.lang))
    .sort((a, b) => rankLang(a) - rankLang(b) || Number(b.localService) - Number(a.localService));
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
      if (!("speechSynthesis" in window) || speechSynthesis.getVoices().length === 0) return onFail?.();
      speechSynthesis.cancel();
      const run = ++runRef.current;
      let watchdog: ReturnType<typeof setTimeout> | undefined;
      const cast = castVoices(speechSynthesis.getVoices(), speakers);
      const queue = script.flatMap((line, li) =>
        sentences(line.text).map((text, si) => ({ speaker: line.speaker, text, newLine: si === 0 && li > 0 })),
      );
      let i = 0;
      const next = () => {
        if (run !== runRef.current) return;
        if (i >= queue.length) {
          setSpeaking(null);
          onEnd?.();
          return;
        }
        const item = queue[i++];
        const c = cast.get(item.speaker);
        const u = new SpeechSynthesisUtterance(item.text);
        if (c?.voice) {
          u.voice = c.voice;
          u.lang = c.voice.lang;
        } else {
          u.lang = "en-CA";
        }
        u.pitch = c?.pitch ?? 1;
        u.rate = 0.95;
        u.onstart = () => clearTimeout(watchdog);
        u.onend = () => next();
        u.onerror = (e) => {
          if (e.error !== "interrupted" && e.error !== "canceled") next();
        };
        const start = () => {
          if (run !== runRef.current) return;
          setSpeaking(item.speaker);
          speechSynthesis.speak(u);
          // Some browsers expose the API but never actually speak; bail out to the transcript.
          clearTimeout(watchdog);
          watchdog = setTimeout(() => {
            if (run !== runRef.current) return;
            runRef.current++;
            speechSynthesis.cancel();
            setSpeaking(null);
            onFail?.();
          }, 5000);
        };
        // Short pause when the speaker changes, like a real conversation.
        if (item.newLine) setTimeout(start, 350);
        else start();
      };
      next();
    },
    [],
  );

  useEffect(() => stop, [stop]);

  return { supported, hasVoices: voices.length > 0, speaking, play, stop };
}
