"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";

const AUTH_USER_ID_KEY = ["auth", "session", "userId"] as const;

export function useAuthUserId() {
  return useQuery({
    queryKey: AUTH_USER_ID_KEY,
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
