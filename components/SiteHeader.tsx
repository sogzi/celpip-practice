"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FEATURES } from "@/lib/features";
import { AuthMenu } from "./AuthMenu";
import { ThemeToggle } from "./ThemeToggle";

const NAV = [
  { href: "/reading", label: "Reading" },
  { href: "/listening", label: "Listening" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  ...(FEATURES.mockExam ? [{ href: "/exam", label: "Mock exam" }] : []),
  { href: "/history", label: "Progress" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-3 sm:gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight shrink-0" aria-label="Prepfluent home">
          <span aria-hidden className="grid place-items-center size-7 rounded-md bg-accent text-accent-ink text-sm">
            P
          </span>
          <span className="hidden sm:inline">Prepfluent</span>
        </Link>
        <nav className="flex-1 min-w-0 flex items-center sm:justify-end gap-0.5 sm:gap-1 text-sm overflow-x-auto no-scrollbar">
          {NAV.map((n) => {
            const active = path.startsWith(n.href);
            return (
              <Link
                key={n.href}
                href={n.href}
                className={`px-2 sm:px-3 py-1.5 rounded-md whitespace-nowrap transition-colors ${
                  active ? "bg-surface-2 text-ink font-medium" : "text-muted hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <ThemeToggle />
        <AuthMenu />
      </div>
    </header>
  );
}
