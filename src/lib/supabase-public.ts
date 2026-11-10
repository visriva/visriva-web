import "server-only";
import { createClient } from "@supabase/supabase-js";

/**
 * Public, RLS-constrained Supabase client for server-rendered catalogue reads
 * and the insert-only public enquiry API. Never use this for admin mutations.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
