import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for server-side operations (API routes, ingestion).
 * Uses the service-role key for full database access.
 * NEVER import this in client components.
 */
export function getSupabaseServer() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
