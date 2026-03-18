"use client";

import { useQuery } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import {
  getRandomCuriosity,
  type GetRandomCuriosityOptions,
} from "@/lib/services/content/get-random-curiosity";
import { curiosityQueryKeys } from "@/lib/query/query-keys";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";

export function useRandomCuriosity(options: GetRandomCuriosityOptions = {}) {
  const { difficultyLevel, excludeSlug } = options;

  return useQuery<LoadedCuriosityExperience | null, Error>({
    queryKey: curiosityQueryKeys.random(difficultyLevel, excludeSlug),
    queryFn: async () => {
      const supabase = createSupabaseBrowserClient();
      return getRandomCuriosity(supabase, options);
    },
    staleTime: 0,
  });
}
