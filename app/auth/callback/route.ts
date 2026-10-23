import { type NextRequest, NextResponse } from "next/server";
import { safeNext } from "@/lib/auth-paths";
import { createClient } from "@/lib/supabase/server";

// Handles the return from Google sign-in, email confirmation and password reset links.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeNext(searchParams.get("next"));
  const providerError = searchParams.get("error_description") ?? searchParams.get("error");

  if (providerError) {
    return NextResponse.redirect(`${origin}/auth/error?reason=${encodeURIComponent(providerError)}`);
  }
  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(`${origin}${next}`);
    console.error("[auth/callback]", error.message);
    return NextResponse.redirect(`${origin}/auth/error?reason=${encodeURIComponent(error.message)}`);
  }
  return NextResponse.redirect(`${origin}/auth/error`);
}
