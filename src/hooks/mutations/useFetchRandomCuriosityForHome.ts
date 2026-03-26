"use client";

import { useMutation } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getRandomCuriosityForDisplay } from "@/lib/services/content/get-random-curiosity";
import type { RandomCuriosityForDisplay } from "@/lib/services/content/get-random-curiosity";

export type FetchRandomCuriosityInput = {
  /** Exclude this slug to avoid repeat (e.g. current daily) */
  excludeSlug?: string | null;
};

export function useFetchRandomCuriosityForHome() {
  return useMutation<RandomCuriosityForDisplay | null, Error, FetchRandomCuriosityInput>({
    mutationKey: ["curiosity", "feed-random-for-home"],
    mutationFn: async (input) => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      return getRandomCuriosityForDisplay(supabase, {
        excludeSlug: input.excludeSlug?.trim() || undefined,
        userId: user?.id ?? null,
      });
    },
  });
}
