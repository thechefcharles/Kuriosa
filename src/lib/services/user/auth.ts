import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";

/**
 * Server-only auth helpers (`cookies()`). Still used by API routes and internal tools — not
 * for user-facing page gating when a client guard exists. See `auth-client.ts` and
 * `KURIOSA_MOBILE_AUTH_AND_GUARDS.md`.
 */

export async function getCurrentUser() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return null;
  return user;
}

export async function getCurrentSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error || !data) return null;
  return data;
}
