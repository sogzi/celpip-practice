"use client";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";
const KEY = "celpip-practice:theme";
const listeners = new Set<() => void>();

function subscribe(fn: () => void) {
  listeners.add(fn);
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", fn);
  return () => {
    listeners.delete(fn);
    mq.removeEventListener("change", fn);
  };
}

/** The theme currently on screen: the user's choice, or the device setting. */
function getTheme(): Theme {
  const chosen = document.documentElement.dataset.theme;
  if (chosen === "light" || chosen === "dark") return chosen;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(KEY, theme);
  } catch {}
  listeners.forEach((fn) => fn());
}

/**
 * Runs in <head> before the page paints so a saved theme never flashes the wrong colours.
 * Kept as a string because it's inlined into the HTML.
 */
export const themeInitScript = `try{var t=localStorage.getItem(${JSON.stringify(KEY)});if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={theme ? `Switch to ${next} mode` : "Toggle colour theme"}
      title={theme ? `Switch to ${next} mode` : undefined}
      className="shrink-0 grid place-items-center size-8 rounded-md text-muted hover:text-ink hover:bg-surface-2 transition-colors"
    >
      {theme === "dark" ? (
        // Sun: shown in dark mode, switches to light
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        // Moon: shown in light mode (and before hydration), switches to dark
        <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      )}
    </button>
  );
}
