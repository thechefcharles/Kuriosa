"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";

export type RequireAuthState =
  | { status: "loading" }
  | { status: "authenticated"; user: User }
  | { status: "unauthenticated" };

/**
 * Subscribes to Supabase browser auth. For use in client guards and components that need
 * session without React Query (avoids circular deps with `ProtectedAppRoute`).
 */
export function useRequireAuth(): RequireAuthState {
  const [state, setState] = useState<RequireAuthState>({ status: "loading" });

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    function syncFromSession() {
      supabase.auth.getUser().then(({ data: { user }, error }) => {
        if (error) {
          setState({ status: "unauthenticated" });
          return;
        }
        if (user) setState({ status: "authenticated", user });
        else setState({ status: "unauthenticated" });
      });
    }

    syncFromSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setState({ status: "authenticated", user: session.user });
      } else {
        setState({ status: "unauthenticated" });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
