"use client";
import Link from "next/link";
import { useState } from "react";
import { AuthCard, Field, FormError, authMessage } from "@/components/AuthUI";
import { btn } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

export function ForgotForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email")).trim();
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/auth/update-password`,
    });
    setBusy(false);
    if (error) return setError(authMessage(error.message));
    setSent(true);
  }

  return (
    <AuthCard
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={sent ? "If an account exists for that email, we've sent a link to reset your password." : "Enter your email and we'll send you a link to choose a new password."}
      footer={<Link href="/login" className="text-accent font-medium">Back to log in</Link>}
    >
      {!sent && (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email" name="email" type="email" autoComplete="email" required disabled={busy} />
          <FormError message={error} />
          <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
