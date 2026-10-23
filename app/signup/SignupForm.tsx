"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { AuthCard, Divider, Field, FormError, GoogleButton, LegalNote, authMessage } from "@/components/AuthUI";
import { btn } from "@/components/ui";
import { safeNext } from "@/lib/auth-paths";
import { createClient } from "@/lib/supabase/client";

export function SignupForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = safeNext(params.get("next"));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [sentTo, setSentTo] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email")).trim();
    const password = String(form.get("password"));
    if (password.length < 8) return setError("Please use at least 8 characters for your password.");
    setBusy(true);
    setError(undefined);
    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: String(form.get("name")).trim() },
        emailRedirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setError(authMessage(error.message));
      setBusy(false);
      return;
    }
    if (data.session) {
      // Email confirmation is turned off: the user is already signed in.
      router.replace(next);
      router.refresh();
      return;
    }
    setSentTo(email);
    setBusy(false);
  }

  if (sentTo) {
    return (
      <AuthCard title="Check your email" subtitle={`We sent a confirmation link to ${sentTo}.`}>
        <div className="space-y-3 text-sm text-muted leading-relaxed">
          <p>Click the link in the email to activate your account. Open it in this browser so you&apos;re signed in straight away.</p>
          <p>Didn&apos;t get it? Check your spam folder, or wait a minute and try signing up again.</p>
          <Link href="/login" className={`${btn.secondary} w-full mt-2`}>Back to log in</Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Free practice for all four CELPIP skills, with your progress saved."
      footer={
        <>
          Already have an account?{" "}
          <Link href={`/login${next !== "/" ? `?next=${encodeURIComponent(next)}` : ""}`} className="text-accent font-medium">
            Log in
          </Link>
        </>
      }
    >
      <GoogleButton next={next} label="Sign up with Google" />
      <Divider />
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Name" name="name" autoComplete="name" required maxLength={100} disabled={busy} />
        <Field label="Email" name="email" type="email" autoComplete="email" required disabled={busy} />
        <Field label="Password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." disabled={busy} />
        <FormError message={error} />
        <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
          {busy ? "Creating your account…" : "Create account"}
        </button>
        <LegalNote />
      </form>
    </AuthCard>
  );
}
