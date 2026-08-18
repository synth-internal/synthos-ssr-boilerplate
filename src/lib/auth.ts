// Auth seam — a thin, standard wrapper over Supabase Auth (email + password).
//
// SynthOS seeds a standard set of accounts into this project's Supabase as a
// build standard: one admin login plus one demo login per teammate (see
// `.synth/rules.md` → "Standard accounts"). They are real `auth.users`, so the
// email/password sign-in below works against them out of the box — you do NOT
// hardcode any admin/demo credentials in the product.
//
// When Supabase isn't wired yet (a fresh boilerplate) every call is a guarded
// no-op so the app still builds and runs; feature-check `hasSupabase` first.
import { supabase, hasSupabase } from "./supabase";
import type { Session, User } from "@supabase/supabase-js";

export { hasSupabase };

/** Sign in with one of the standard accounts (or any other Supabase user). */
export async function signIn(email: string, password: string): Promise<User> {
  if (!supabase) throw new Error("Auth is not configured yet.");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

/** The public origin confirmation / reset emails should point back to: the
 * LIVE site URL baked in at build (APP_BASE_URL), else the current browser
 * origin. Never localhost in production because APP_BASE_URL is the deployed
 * address. */
function authRedirectBase(): string | undefined {
  const baked = (import.meta.env.APP_BASE_URL as string | undefined)?.replace(/\/+$/, "");
  if (baked) return baked;
  if (typeof window !== "undefined") return window.location.origin;
  return undefined;
}

/** Register a new account. Supabase emails a confirmation link; we anchor it to
 * the live site (APP_BASE_URL) via `emailRedirectTo` so it never routes to
 * localhost. `redirectPath` is where the link lands after confirming. The
 * project's Supabase auth config also has this URL allow-listed server-side, so
 * the link is correct even if a caller forgets to pass one. */
export async function signUp(email: string, password: string, redirectPath = "/"): Promise<User | null> {
  if (!supabase) throw new Error("Auth is not configured yet.");
  const base = authRedirectBase();
  const emailRedirectTo = base
    ? `${base}${redirectPath.startsWith("/") ? "" : "/"}${redirectPath}`
    : undefined;
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    ...(emailRedirectTo ? { options: { emailRedirectTo } } : {}),
  });
  if (error) throw error;
  return data.user;
}

export async function signOut(): Promise<void> {
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function getSession(): Promise<Session | null> {
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

/** Subscribe to sign-in / sign-out changes. Returns an unsubscribe fn. */
export function onAuthChange(cb: (user: User | null) => void): () => void {
  if (!supabase) return () => {};
  const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session?.user ?? null));
  return () => data.subscription.unsubscribe();
}
