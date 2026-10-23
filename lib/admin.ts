import "server-only";
import { createClient } from "./supabase/server";

/** Emails allowed to see admin pages, from ADMIN_EMAILS (comma-separated). */
function adminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** The signed-in admin's email, or null if the visitor isn't an admin. */
export async function getAdmin() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const email = typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : null;
  return email && adminEmails().includes(email) ? email : null;
}
