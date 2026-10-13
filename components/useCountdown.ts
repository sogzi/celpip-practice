"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Wall-clock based countdown, so it stays accurate if the tab is throttled. */
export function useCountdown(onDone?: () => void) {
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const endRef = useRef(0);
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const left = (endRef.current - Date.now()) / 1000;
      if (left <= 0) {
        setRemaining(0);
        setRunning(false);
        doneRef.current?.();
      } else {
        setRemaining(left);
      }
    }, 200);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback((seconds: number) => {
    endRef.current = Date.now() + seconds * 1000;
    setRemaining(seconds);
    setRunning(true);
  }, []);

  const stop = useCallback(() => setRunning(false), []);

  return { remaining, running, start, stop };
}
