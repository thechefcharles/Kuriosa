"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getDailyCuriosity } from "@/lib/services/content/get-daily-curiosity";
import { curiosityQueryKeys } from "@/lib/query/query-keys";
import type { DailyCuriosityResult } from "@/lib/services/content/get-daily-curiosity";

export function useDailyCuriosity(dateISO?: string) {
  return useQuery<DailyCuriosityResult | null, Error>({
    queryKey: curiosityQueryKeys.daily(dateISO),
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      return getDailyCuriosity(supabase, dateISO);
    },
  });
}
