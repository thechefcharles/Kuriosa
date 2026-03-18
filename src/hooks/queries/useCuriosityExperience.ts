"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { loadCuriosityExperience } from "@/lib/services/content/load-curiosity-experience";
import { curiosityQueryKeys } from "@/lib/query/query-keys";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";

export function useCuriosityExperience(slug: string | undefined) {
  return useQuery<LoadedCuriosityExperience | null, Error>({
    queryKey: curiosityQueryKeys.bySlug(slug ?? ""),
    queryFn: async () => {
      if (!slug?.trim()) return null;
      const supabase = createSupabaseBrowserClient();
      return loadCuriosityExperience(supabase, { slug: slug.trim() });
    },
    enabled: Boolean(slug?.trim()),
  });
}
