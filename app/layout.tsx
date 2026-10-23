import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { themeInitScript } from "@/components/ThemeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prepfluent",
  description: "Timed CELPIP-General practice for all four skills, scored on the official 1–12 scale.",
  // Google Search Console ownership check for https://prepfluent.applixr.com/
  verification: { google: "Utq-k41e4UD6etIHvoG_2JQRmz3CvX5ZazcagfF1AgM" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the theme script sets data-theme on <html> before React hydrates.
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">{children}</main>
        <footer className="border-t border-line py-6 text-center text-xs text-muted px-4 space-y-2">
          <nav className="flex justify-center gap-4" aria-label="Legal">
            <Link href="/privacy" className="hover:text-ink">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-ink">Terms of Service</Link>
          </nav>
          <p>Unofficial practice tool. CELPIP is a trademark of Paragon Testing Enterprises. Scores are estimates.</p>
        </footer>
      </body>
    </html>
  );
}
