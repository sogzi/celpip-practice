"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { SITE } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";
import { Card } from "./ui";

export function AuthCard({ title, subtitle, children, footer }: { title: string; subtitle?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="max-w-md mx-auto">
      <Card className="p-6 sm:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </Card>
      {footer && <p className="mt-5 text-center text-sm text-muted">{footer}</p>}
    </div>
  );
}

export function Field({
  label,
  hint,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] outline-none focus:border-muted disabled:opacity-60"
      />
      {hint && <span className="mt-1 block text-xs text-muted">{hint}</span>}
    </label>
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="rounded-lg bg-accent-soft text-accent px-3 py-2 text-sm">
      {message}
    </p>
  );
}

export function Divider() {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-muted">
      <span className="h-px flex-1 bg-line" />
      or
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

// --- Google sign-in -------------------------------------------------------------
// Uses Google's own button (Google Identity Services) and signInWithIdToken, so the
// sign-in happens on our domain instead of redirecting through <project>.supabase.co.

interface GoogleCredentialResponse {
  credential: string;
}
interface GoogleId {
  initialize(config: {
    client_id: string;
    callback: (r: GoogleCredentialResponse) => void;
    nonce?: string;
    use_fedcm_for_prompt?: boolean;
    ux_mode?: "popup" | "redirect";
    context?: "signin" | "signup" | "use";
    itp_support?: boolean;
  }): void;
  renderButton(
    el: HTMLElement,
    options: { type?: string; theme?: string; size?: string; text?: string; shape?: string; width?: number; logo_alignment?: string },
  ): void;
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

/** Raw nonce goes to Supabase; its SHA-256 hex hash goes to Google. */
async function generateNonce(): Promise<[string, string]> {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(nonce));
  const hashed = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return [nonce, hashed];
}

export function GoogleButton({ next, label = "Continue with Google" }: { next: string; label?: string }) {
  const router = useRouter();
  const container = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [failed, setFailed] = useState(false);
  const isSignup = label.toLowerCase().includes("sign up");
  const reinit = useRef<() => void>(() => {});

  const init = useCallback(async () => {
    const el = container.current;
    if (!window.google || !el) return;
    const [nonce, hashedNonce] = await generateNonce();
    window.google.accounts.id.initialize({
      client_id: SITE.googleClientId,
      nonce: hashedNonce,
      ux_mode: "popup",
      context: isSignup ? "signup" : "signin",
      itp_support: true,
      use_fedcm_for_prompt: true,
      callback: async ({ credential }) => {
        setBusy(true);
        setError(undefined);
        const { error } = await createClient().auth.signInWithIdToken({ provider: "google", token: credential, nonce });
        if (error) {
          console.error("[google]", error.message);
          setError("Google sign-in didn't work. Please try again, or use your email instead.");
          setBusy(false);
          reinit.current(); // fresh nonce for the next attempt
          return;
        }
        router.replace(next);
        router.refresh();
      },
    });
    const dark = document.documentElement.dataset.theme === "dark" ||
      (document.documentElement.dataset.theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
    el.replaceChildren();
    window.google.accounts.id.renderButton(el, {
      type: "standard",
      theme: dark ? "filled_black" : "outline",
      size: "large",
      text: isSignup ? "signup_with" : "continue_with",
      shape: "rectangular",
      logo_alignment: "center",
      width: Math.min(400, Math.max(200, Math.floor(el.getBoundingClientRect().width))),
    });
  }, [isSignup, next, router]);

  // The script may already be loaded when moving between the login and sign-up pages.
  useEffect(() => {
    reinit.current = () => void init();
    if (window.google) void init();
  }, [init]);

  if (failed) return <GoogleRedirectButton next={next} label={label} />;

  return (
    <div className="space-y-2">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" onReady={() => void init()} onError={() => setFailed(true)} />
      <div ref={container} className={`flex justify-center min-h-[44px] ${busy ? "opacity-50 pointer-events-none" : ""}`} aria-busy={busy} />
      {busy && <p className="text-center text-xs text-muted">Signing you in…</p>}
      <FormError message={error} />
    </div>
  );
}

/** Fallback when Google's script can't load (e.g. blocked by an extension): redirect flow. */
function GoogleRedirectButton({ next, label }: { next: string; label: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  async function go() {
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setError("Google sign-in isn't available right now. Please use your email instead.");
      setBusy(false);
    }
  }
  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={go}
        disabled={busy}
        className="w-full inline-flex items-center justify-center gap-3 rounded-lg border border-line bg-surface px-4 py-2.5 text-sm font-medium hover:bg-surface-2 disabled:opacity-60 transition"
      >
        <svg viewBox="0 0 48 48" className="size-[18px]" aria-hidden>
          <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
          <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
          <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
          <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
        </svg>
        {busy ? "Redirecting to Google…" : label}
      </button>
      <FormError message={error} />
    </div>
  );
}

export function LegalNote() {
  return (
    <p className="text-xs text-muted leading-relaxed">
      By continuing, you agree to our{" "}
      <Link href="/terms" className="underline hover:text-ink">Terms of Service</Link> and{" "}
      <Link href="/privacy" className="underline hover:text-ink">Privacy Policy</Link>.
    </p>
  );
}

/** Friendlier wording for common Supabase Auth errors. */
export function authMessage(message: string) {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "That email and password don't match. Please try again.";
  if (m.includes("email not confirmed")) return "Please confirm your email first. Check your inbox for the link we sent.";
  if (m.includes("already registered") || m.includes("already been registered")) return "An account with this email already exists. Try logging in instead.";
  if (m.includes("rate limit") || m.includes("too many")) return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("password") && (m.includes("at least") || m.includes("weak") || m.includes("short"))) return "Please choose a stronger password (at least 8 characters).";
  if (m.includes("same as") || m.includes("different from the old")) return "Your new password must be different from your current one.";
  return "Something went wrong. Please try again.";
}
