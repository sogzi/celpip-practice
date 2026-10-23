"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Field, FormError } from "@/components/AuthUI";
import { Card, btn } from "@/components/ui";
import { useUser } from "@/components/useUser";
import { SITE } from "@/lib/site";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  email: string | null;
  full_name: string | null;
  target_level: number | null;
  created_at: string;
}

export function AccountView() {
  const router = useRouter();
  const params = useSearchParams();
  const user = useUser();
  const [profile, setProfile] = useState<Profile | null>();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(params.get("updated") === "password" ? "Your password has been changed." : "");
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (!user) return;
    createClient()
      .from("profiles")
      .select("email, full_name, target_level, created_at")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) console.error("[account]", error.message);
        setProfile((data as Profile | null) ?? null);
      });
  }, [user]);

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) return;
    const form = new FormData(e.currentTarget);
    const level = String(form.get("target_level"));
    setSaving(true);
    setError(undefined);
    setSaved("");
    const update = { full_name: String(form.get("full_name")).trim() || null, target_level: level ? Number(level) : null };
    const { error } = await createClient().from("profiles").update(update).eq("id", user.id);
    setSaving(false);
    if (error) return setError("Couldn't save your changes. Please try again.");
    setProfile((p) => (p ? { ...p, ...update } : p));
    setSaved("Your profile has been saved.");
  }

  async function logOut() {
    await createClient().auth.signOut();
    router.replace("/");
    router.refresh();
  }

  if (user === undefined || (user && profile === undefined)) return <div className="h-96" />;
  if (!user) return null; // proxy.ts redirects logged-out visitors to /login

  const providers = (user.app_metadata.providers as string[] | undefined) ?? [user.app_metadata.provider ?? "email"];
  const usesPassword = providers.includes("email");

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Your account</h1>
        <p className="mt-1 text-muted">{user.email}</p>
      </div>

      <Card className="p-6">
        <h2 className="font-semibold">Profile</h2>
        <form onSubmit={onSave} className="mt-4 space-y-4">
          <Field label="Name" name="full_name" defaultValue={profile?.full_name ?? ""} maxLength={100} autoComplete="name" disabled={saving} />
          <label className="block">
            <span className="text-sm font-medium">Target CELPIP level</span>
            <select
              name="target_level"
              defaultValue={profile?.target_level ?? ""}
              disabled={saving}
              className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3 py-2.5 text-[15px] outline-none focus:border-muted"
            >
              <option value="">Not set</option>
              {Array.from({ length: 12 }, (_, i) => 12 - i).map((l) => (
                <option key={l} value={l}>Level {l}</option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-muted">The level you&apos;re aiming for, e.g. CLB 7 for Express Entry.</span>
          </label>
          <FormError message={error} />
          {saved && <p className="rounded-lg bg-good-soft text-good px-3 py-2 text-sm">{saved}</p>}
          <button type="submit" className={btn.primary} disabled={saving}>{saving ? "Saving…" : "Save changes"}</button>
        </form>
      </Card>

      <Card className="p-6 space-y-3">
        <h2 className="font-semibold">Sign-in</h2>
        <p className="text-sm text-muted">
          You sign in with {providers.map((p) => (p === "email" ? "email and password" : p === "google" ? "Google" : p)).join(" and ")}.
          {profile?.created_at && ` Member since ${new Date(profile.created_at).toLocaleDateString(undefined, { dateStyle: "long" })}.`}
        </p>
        <div className="flex flex-wrap gap-2">
          {usesPassword && (
            <button className={btn.secondary} onClick={() => router.push("/auth/update-password")}>Change password</button>
          )}
          <button className={btn.secondary} onClick={logOut}>Log out</button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="font-semibold">Delete account</h2>
        <p className="mt-1 text-sm text-muted">
          To delete your account and profile, email{" "}
          <a className="text-accent underline" href={`mailto:${SITE.contactEmail}?subject=Delete my Prepfluent account&body=Please delete the account for ${user.email}.`}>
            {SITE.contactEmail}
          </a>{" "}
          from your account email. We&apos;ll confirm within 30 days.
        </p>
      </Card>
    </div>
  );
}
