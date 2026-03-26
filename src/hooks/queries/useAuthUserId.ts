"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";

/** Shared key for session-derived user id; invalidate after sign-in / sign-out. */
export const AUTH_SESSION_USER_ID_QUERY_KEY = ["auth", "session", "userId"] as const;

export function useAuthUserId() {
  return useQuery({
    queryKey: AUTH_SESSION_USER_ID_QUERY_KEY,
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user?.id ?? null;
    },
    staleTime: 60_000,
  });
}
