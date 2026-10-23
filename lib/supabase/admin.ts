import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Server-only client with the secret key. It bypasses row level security, so use it
 * only for trusted server work (usage tracking, admin reports), never with user input
 * that chooses whose data to touch.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, key!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
