"use client";
import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/history";

/** The signed-in user's practice history, loaded from their account. */
export function useHistory() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useAttempts() {
  return useHistory().attempts;
}
