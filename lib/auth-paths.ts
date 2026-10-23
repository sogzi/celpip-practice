// Pages anyone can open without logging in. Everything else requires an account.
const PUBLIC_EXACT = new Set(["/", "/login", "/signup", "/forgot-password", "/privacy", "/terms", "/manifest.webmanifest"]);
const PUBLIC_PREFIXES = ["/auth/", "/brand/"];

export function isPublicPath(pathname: string) {
  return PUBLIC_EXACT.has(pathname) || PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

/** Only allow redirects back to our own pages (prevents open redirects). */
export function safeNext(next: string | null | undefined, fallback = "/") {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return fallback;
  return next;
}
