"use client";

import { useMutation } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getRandomTopicCards } from "@/lib/services/discovery/get-random-topics";
import type { TopicCardView } from "@/types/discovery";

export type FetchRandomTopicCardsInput = {
  limit?: number;
  categorySlug?: string | null;
  difficultyLevel?: string | null;
};

export function useFetchRandomTopicCards() {
  return useMutation<TopicCardView[], Error, FetchRandomTopicCardsInput>({
    mutationKey: ["discovery", "random-topic-cards"],
    mutationFn: async (input) => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      return getRandomTopicCards(supabase, {
        limit: input.limit ?? 6,
        categorySlug: input.categorySlug?.trim() || undefined,
        difficultyLevel: input.difficultyLevel?.trim() || undefined,
        userId: user?.id ?? null,
      });
    },
  });
}
