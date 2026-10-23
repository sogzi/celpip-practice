"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AuthCard, Field, FormError, authMessage } from "@/components/AuthUI";
import { btn } from "@/components/ui";
import { useUser } from "@/components/useUser";
import { createClient } from "@/lib/supabase/client";

export function UpdatePasswordForm() {
  const router = useRouter();
  const user = useUser();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = String(form.get("password"));
    if (password.length < 8) return setError("Please use at least 8 characters.");
    if (password !== String(form.get("confirm"))) return setError("The two passwords don't match.");
    setBusy(true);
    setError(undefined);
    const { error } = await createClient().auth.updateUser({ password });
    if (error) {
      setError(authMessage(error.message));
      setBusy(false);
      return;
    }
    router.replace("/account?updated=password");
    router.refresh();
  }

  if (user === undefined) return <div className="h-96" />;
  if (user === null) {
    return (
      <AuthCard title="Link expired" subtitle="Please request a new password reset link.">
        <Link href="/forgot-password" className={`${btn.primary} w-full`}>Reset password</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" subtitle={`For ${user.email}`}>
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="New password" name="password" type="password" autoComplete="new-password" required minLength={8} hint="At least 8 characters." disabled={busy} />
        <Field label="Confirm new password" name="confirm" type="password" autoComplete="new-password" required minLength={8} disabled={busy} />
        <FormError message={error} />
        <button type="submit" className={`${btn.primary} w-full`} disabled={busy}>
          {busy ? "Saving…" : "Save new password"}
        </button>
      </form>
    </AuthCard>
  );
}
