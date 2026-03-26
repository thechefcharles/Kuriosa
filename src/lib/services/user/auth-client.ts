/**
 * Client-safe Supabase auth (browser `createBrowserClient`).
 *
 * Use from `"use client"` components for sign-in, sign-up, and sign-out so flows work when
 * there is no Next Server Action or cookie-mirroring server round-trip (e.g. Capacitor static shell).
 *
 * **Coexistence:** `auth-actions.ts` remains for optional server-side use or tooling; user-facing
 * pages should call these functions instead. See `KURIOSA_MOBILE_AUTH_AND_GUARDS.md`.
 */

import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";

export type AuthClientErrorResult = { ok: false; error: string };
export type AuthClientOkResult = { ok: true };
export type AuthClientResult = AuthClientErrorResult | AuthClientOkResult;

function requireCredentials(email: string, password: string): string | null {
  if (!email?.trim() || !password) {
    return "Email and password are required";
  }
  return null;
}

function signInDebugEnabled() {
  return process.env.NEXT_PUBLIC_DEBUG_SIGN_IN === "1";
}

export async function clientSignIn(input: {
  email: string;
  password: string;
}): Promise<AuthClientResult> {
  const msg = requireCredentials(input.email, input.password);
  if (msg) return { ok: false, error: msg };

  const supabase = createSupabaseBrowserClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: input.email.trim(),
    password: input.password,
  });

  if (signInDebugEnabled()) {
    console.log("signInWithPassword result", { data, error });
  }

  if (error) {
    if (signInDebugEnabled() && typeof window !== "undefined") {
      window.alert(`Sign in failed: ${error.message}`);
    }
    return { ok: false, error: error.message };
  }

  if (signInDebugEnabled()) {
    const sessionResult = await supabase.auth.getSession();
    console.log("session after sign in", sessionResult);
    if (typeof window !== "undefined") {
      window.alert(
        `Session exists: ${Boolean(sessionResult.data.session)}`
      );
    }
  }

  return { ok: true };
}

export async function clientSignUp(input: {
  email: string;
  password: string;
}): Promise<AuthClientResult> {
  const msg = requireCredentials(input.email, input.password);
  if (msg) return { ok: false, error: msg };

  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signUp({
    email: input.email.trim(),
    password: input.password,
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export async function clientSignOut(): Promise<AuthClientResult> {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
