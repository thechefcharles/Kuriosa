import { Capacitor } from "@capacitor/core";
import { createBrowserClient } from "@supabase/ssr";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * `createBrowserClient` (@supabase/ssr) persists the session via `document.cookie`.
 * On Capacitor’s `capacitor://` WebView, those cookies are unreliable, so
 * `signInWithPassword` can return a session while `getSession()` immediately sees `null`.
 * Native shells use `localStorage` instead (Supabase’s default storage adapter).
 */
let nativeSingleton: SupabaseClient | null = null;

export function createSupabaseBrowserClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error("Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  if (typeof window !== "undefined" && Capacitor.isNativePlatform()) {
    if (!nativeSingleton) {
      nativeSingleton = createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
          flowType: "pkce",
          storage: window.localStorage,
        },
      });
    }
    return nativeSingleton;
  }

  return createBrowserClient(url, anonKey);
}

export const supabaseBrowser = createSupabaseBrowserClient();
