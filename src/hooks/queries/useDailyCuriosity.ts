"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getDailyCuriosity } from "@/lib/services/content/get-daily-curiosity";
import { curiosityQueryKeys } from "@/lib/query/query-keys";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { DailyCuriosityResult } from "@/lib/services/content/get-daily-curiosity";

export function useDailyCuriosity(dateISO?: string) {
  const { data: userId } = useAuthUserId();

  return useQuery<DailyCuriosityResult | null, Error>({
    queryKey: [...curiosityQueryKeys.daily(dateISO), userId ?? "guest"],
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      return getDailyCuriosity(supabase, dateISO, { userId: userId ?? null });
    },
  });
}
