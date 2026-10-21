"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/reading", label: "Reading" },
  { href: "/listening", label: "Listening" },
  { href: "/writing", label: "Writing" },
  { href: "/speaking", label: "Speaking" },
  { href: "/exam", label: "Mock exam" },
  { href: "/history", label: "Progress" },
];

export function SiteHeader() {
  const path = usePathname();
  return (
    <header className="border-b border-line bg-surface/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight shrink-0" aria-label="CELPIP Practice home">
          <span aria-hidden className="grid place-items-center size-7 rounded-md bg-accent text-accent-ink text-sm">
            C
          </span>
          <span className="hidden sm:inline">CELPIP Practice</span>
        </Link>
        <nav className="flex items-center gap-0.5 sm:gap-1 text-sm overflow-x-auto no-scrollbar -mr-2 pr-2">
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
      </div>
    </header>
  );
}
