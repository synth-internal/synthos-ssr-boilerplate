// Supabase client seam. Created from the PUBLIC project URL + anon key, which
// are baked into the bundle at build time (see vite.config.ts). Row-level
// security is what actually protects data — never put a service key or any
// other secret in client code.
//
// When the values are unset (a fresh boilerplate with no backend yet) this is a
// guarded no-op: `supabase` is null and callers should feature-check it.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.SUPABASE_URL;
const anonKey = import.meta.env.SUPABASE_ANON_KEY;

export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;

export const hasSupabase = supabase !== null;
