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
  const w = window as unknown as { SpeechRecognition?: RecognitionCtor; webkitSpeechRecognition?: RecognitionCtor };
  return w.SpeechRecognition || w.webkitSpeechRecognition;
}

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

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<Recognition | null>(null);
  const activeRef = useRef(false);
  const finalRef = useRef("");
  const interimRef = useRef("");
  const startedAtRef = useRef(0);
  const durationRef = useRef(0);

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
    setFinalText("");
    setInterim("");
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

    const Ctor = getRecognitionCtor();
    if (Ctor) {
      const r = new Ctor();
      r.lang = "en-CA";
      r.continuous = true;
      r.interimResults = true;
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
      r.onend = () => {
        if (activeRef.current) {
          try { r.start(); } catch {}
        }
      };
      r.onerror = (e) => {
        if (e.error === "not-allowed" || e.error === "service-not-allowed") {
          setBlocked(true);
        }
      };
      try { r.start(); } catch {}
      recognitionRef.current = r;
    }

    activeRef.current = true;
    startedAtRef.current = Date.now();
    setRecording(true);
  }, []);

  const stop = useCallback(() => {
    if (!activeRef.current) return durationRef.current;
    activeRef.current = false;
    durationRef.current = (Date.now() - startedAtRef.current) / 1000;
    recorderRef.current?.stop();
    recognitionRef.current?.stop();
    setRecording(false);
    // Fold any pending interim words into the transcript.
    if (interimRef.current.trim()) {
      finalRef.current = `${finalRef.current} ${interimRef.current.trim()}`.trim();
      setFinalText(finalRef.current);
    }
    interimRef.current = "";
    setInterim("");
    return durationRef.current;
  }, []);

  const release = useCallback(() => {
    activeRef.current = false;
    recognitionRef.current?.stop();
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(() => release, [release]);

  return {
    supportsTranscription, recording, transcript: finalText, interim, audioUrl, error,
    prepare, start, stop, release, setTranscript: setFinalText,
  };
}
