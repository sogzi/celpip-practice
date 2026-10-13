"use client";
import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe } from "@/lib/history";

export function useAttempts() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
