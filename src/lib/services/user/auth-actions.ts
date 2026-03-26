"use server";

/**
 * Legacy Server Actions: cookie-backed sign-in/up/out + `redirect()`.
 * **User-facing UI** should use `auth-client.ts` (`clientSignIn`, etc.) for Capacitor/static
 * readiness; these remain available for scripts or gradual migration.
 */

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { ROUTES } from "@/lib/constants/routes";

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(ROUTES.home);
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectTo = formData.get("redirect") as string | null;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect(redirectTo || ROUTES.home);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect(ROUTES.landing);
}
