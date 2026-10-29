"use client";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";

// Minimal typings for the Web Speech API (not in every TS DOM lib).
interface RecognitionResult { isFinal: boolean; 0: { transcript: string } }
interface RecognitionEvent { resultIndex: number; results: ArrayLike<RecognitionResult> }
interface Recognition {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((e: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  start(): void;
  stop(): void;
}
type RecognitionCtor = new () => Recognition;

function getRecognitionCtor(): RecognitionCtor | undefined {
  if (typeof window === "undefined") return undefined;
  // Brave exposes the API but its recognition service never returns anything.
  if ((navigator as { brave?: unknown }).brave) return undefined;
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

// Errors after which restarting recognition is pointless.
const FATAL = new Set(["not-allowed", "service-not-allowed", "network", "audio-capture", "language-not-supported"]);
const RECOGNITION_ERRORS: Record<string, string> = {
  "not-allowed": "Speech recognition was blocked in this browser.",
  "service-not-allowed": "Speech recognition is turned off in this browser (on a Mac or iPhone, Safari needs Siri / Dictation turned on).",
  network: "This browser's speech recognition service couldn't be reached.",
  "audio-capture": "Speech recognition couldn't use the microphone.",
  "language-not-supported": "This browser can't transcribe English.",
};
/** Peak RMS below this means the microphone picked up (almost) nothing. */
const SILENCE = 0.01;

const noopSubscribe = () => () => {};

/**
 * Records microphone audio (MediaRecorder) and, where the browser supports it,
 * transcribes live with the Web Speech API.
 */
export function useRecorder() {
  const detected = useSyncExternalStore(noopSubscribe, () => !!getRecognitionCtor(), () => false);
  const [blocked, setBlocked] = useState(false);
  const supportsTranscription = detected && !blocked;
  const [recording, setRecording] = useState(false);
  const [finalText, setFinalText] = useState("");
  const [interim, setInterim] = useState("");
  const [audioUrl, setAudioUrl] = useState<string>();
  const [error, setError] = useState<string>();
  /** Why the automatic transcript failed during the last recording, if it did. */
  const [transcriptError, setTranscriptError] = useState<string>();
  /** Live microphone level, 0–1, while recording. */
  const [level, setLevel] = useState(0);
  /** True when the last recording was (nearly) silent: muted or wrong microphone. */
  const [silent, setSilent] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const activeRef = useRef(false);
  const finalRef = useRef("");
  const interimRef = useRef("");
  const startedAtRef = useRef(0);
  const durationRef = useRef(0);
  const meterRef = useRef<{ ctx: AudioContext; timer: ReturnType<typeof setInterval>; peak: number } | null>(null);
  const flushRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  /** Ask for microphone access ahead of time so the permission prompt doesn't eat into the timer. */
  const prepare = useCallback(async () => {
    setError(undefined);
    if (streamRef.current) return true;
    try {
      streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch {
      setError("Microphone access was blocked. Allow microphone access in your browser's site settings and try again.");
      return false;
    }
  }, []);

  const start = useCallback(() => {
    const stream = streamRef.current;
    if (!stream) return;
    finalRef.current = "";
    interimRef.current = "";
    clearTimeout(flushRef.current);
    setFinalText("");
    setInterim("");
    setTranscriptError(undefined);
    setSilent(false);
    setAudioUrl((old) => {
      if (old) URL.revokeObjectURL(old);
      return undefined;
    });

    const chunks: Blob[] = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
    rec.onstop = () => setAudioUrl(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType })));
    rec.start();
    recorderRef.current = rec;

    // Level meter, so a muted or wrong microphone is obvious straight away.
    try {
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 1024;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const buf = new Float32Array(analyser.fftSize);
      const meter = { ctx, peak: 0, timer: setInterval(() => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += v * v;
        const rms = Math.sqrt(sum / buf.length);
        meter.peak = Math.max(meter.peak, rms);
        setLevel(Math.min(1, rms * 8));
      }, 100) };
      meterRef.current = meter;
    } catch {
      meterRef.current = null;
    }

    const Ctor = getRecognitionCtor();
    if (Ctor) {
      const r = new Ctor();
      r.lang = "en-CA";
      r.continuous = true;
      r.interimResults = true;
      let fatal = false;
      r.onresult = (e) => {
        let interimText = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const res = e.results[i];
          if (res.isFinal) finalRef.current = `${finalRef.current} ${res[0].transcript.trim()}`.trim();
          else interimText += res[0].transcript;
        }
        interimRef.current = interimText;
        setFinalText(finalRef.current);
        setInterim(interimText);
      };
      // Chrome ends recognition after silences; restart while we're still recording.
      // Once recording has stopped, the end event means the last words have arrived.
      r.onend = () => {
        if (activeRef.current && !fatal) {
          try { r.start(); } catch {}
        } else if (!activeRef.current) {
          flushInterim();
        }
      };
      r.onerror = (e) => {
        if (!FATAL.has(e.error)) return; // "no-speech" and "aborted" are normal
        fatal = true;
        setTranscriptError(RECOGNITION_ERRORS[e.error]);
        if (e.error === "not-allowed" || e.error === "service-not-allowed") setBlocked(true);
      };
      try { r.start(); } catch {}
      recognitionRef.current = r;
    }

    activeRef.current = true;
    startedAtRef.current = Date.now();
    setRecording(true);
  }, []);

  /** Fold words still marked as interim into the transcript (once recognition has finished). */
  function flushInterim() {
    clearTimeout(flushRef.current);
    if (interimRef.current.trim()) {
      finalRef.current = `${finalRef.current} ${interimRef.current.trim()}`.trim();
      setFinalText(finalRef.current);
    }
    interimRef.current = "";
    setInterim("");
  }

  function stopMeter() {
    const m = meterRef.current;
    if (!m) return;
    clearInterval(m.timer);
    void m.ctx.close().catch(() => {});
    meterRef.current = null;
    setLevel(0);
    setSilent(m.peak < SILENCE);
  }

  const stop = useCallback(() => {
    if (!activeRef.current) return durationRef.current;
    activeRef.current = false;
    durationRef.current = (Date.now() - startedAtRef.current) / 1000;
    recorderRef.current?.stop();
    stopMeter();
    setRecording(false);
    // Recognition delivers its last words shortly after stopping; wait for them (end event),
    // but don't wait forever.
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      flushRef.current = setTimeout(flushInterim, 2000);
    } else {
      flushInterim();
    }
    return durationRef.current;
  }, []);

  const release = useCallback(() => {
    activeRef.current = false;
    clearTimeout(flushRef.current);
    stopMeter();
    recognitionRef.current?.stop();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => release, [release]);

  return {
    supportsTranscription, recording, transcript: finalText, interim, audioUrl, error, transcriptError, level, silent,
    prepare, start, stop, release, setTranscript: setFinalText,
  };
}
