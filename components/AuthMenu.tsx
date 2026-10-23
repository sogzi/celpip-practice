"use client";
import Link from "next/link";
import { useUser } from "./useUser";

export function AuthMenu() {
  const user = useUser();
  if (user === undefined) return <span className="size-8 shrink-0" aria-hidden />;
  if (!user) {
    return (
      <div className="flex items-center gap-1.5 shrink-0">
        <Link href="/login" className="hidden sm:inline-flex px-3 py-1.5 text-sm text-muted hover:text-ink">Log in</Link>
        <Link href="/signup" className="inline-flex rounded-md bg-accent text-accent-ink px-3 py-1.5 text-sm font-medium hover:opacity-90">Sign up</Link>
      </div>
    );
  }
  const name = (user.user_metadata.full_name as string | undefined) || user.email || "?";
  return (
    <Link
      href="/account"
      title="Your account"
      aria-label="Your account"
      className="shrink-0 grid place-items-center size-8 rounded-full bg-accent-soft text-accent text-sm font-semibold hover:ring-2 hover:ring-accent/40 transition"
    >
      {name.trim()[0]?.toUpperCase()}
    </Link>
  );
}

/** Sign-up buttons for the home page, shown only to visitors who aren't logged in. */
export function HeroAuthButtons() {
  const user = useUser();
  if (user !== null) return null;
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      <Link href="/signup" className="inline-flex items-center rounded-lg bg-accent text-accent-ink px-5 py-2.5 text-sm font-medium hover:opacity-90">
        Create a free account
      </Link>
      <Link href="/login" className="inline-flex items-center rounded-lg border border-line bg-surface px-5 py-2.5 text-sm font-medium hover:bg-surface-2">
        Log in
      </Link>
    </div>
  );
}
