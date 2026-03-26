"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { fetchApi } from "./fetch-api";

/**
 * Like `fetchApi`, but sends `Authorization: Bearer` when a Supabase session exists.
 * Needed for cross-origin calls from Capacitor where host cookies are not available.
 */
export async function fetchApiWithOptionalAuth(
  apiPath: string,
  init: RequestInit = {}
): Promise<Response> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const headers = new Headers(init.headers ?? undefined);
  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }
  return fetchApi(apiPath, { ...init, headers });
}
