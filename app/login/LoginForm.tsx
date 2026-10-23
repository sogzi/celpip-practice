"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthCard, Divider, Field, FormError, GoogleButton, authMessage } from "@/components/AuthUI";
import { btn } from "@/components/ui";
import { safeNext } from "@/lib/auth-paths";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.signInWithPassword({
      email: String(form.get("email")).trim(),
      password: String(form.get("password")),
    });
    if (error) {
      setError(authMessage(error.message));
      setBusy(false);
      return;
    }
    router.replace(next);
    router.refresh();
  }

  return (
    <AuthCard
      title="Log in"
      subtitle="Welcome back. Pick up where you left off."
      footer={
        <>
          New to Prepfluent?{" "}
          <Link href={`/signup${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-accent font-medium">
            Create an account
          </Link>
        </>
      }
    >
      <GoogleButton next={next} />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" name="email" type="email" autoComplete="email" required disabled={busy} />
        <div>
          <Field label="Password" name="password" type="password" autoComplete="current-password" required disabled={busy} />
          <Link href="/forgot-password" className="mt-1.5 inline-block text-xs text-muted hover:text-ink">
            Forgot your password?
          </Link>
        </div>
        <FormError message={error} />
        <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
          {busy ? "Logging in…" : "Log in"}
        </button>
      </form>
    </AuthCard>
  );
}
