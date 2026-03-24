"use client";

import { useMutation } from "@tanstack/react-query";
import { createSupabaseBrowserClient } from "@/lib/supabase/supabase-browser-client";
import { getRandomCuriosity } from "@/lib/services/content/get-random-curiosity";
import { getCompletedTopicIds } from "@/lib/services/progress/get-completed-topic-ids";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";

/** Session key for last random topic slug (repeat avoidance). */
export const KURIOSA_LAST_RANDOM_SLUG_KEY = "kuriosa_last_random_slug";

export type FeedRandomCuriosityInput = {
  /** Matches `topics.difficulty_level` when set; omit for any */
  difficultyLevel?: string;
  /** Restricts random pick to topics in this category (by slug) */
  categorySlug?: string | null;
  /**
   * Today’s daily topic slug — used as exclude target on first spin when
   * no prior random exists this session, so the first surprise isn’t the same card.
   */
  dailyTopicSlug?: string | null;
  /** Slug to exclude from the random pick (e.g. current topic when skipping) */
  excludeSlug?: string | null;
};

function readExcludeSlug(
  dailyTopicSlug?: string | null,
  explicitExclude?: string | null
): string | undefined {
  const explicit = explicitExclude?.trim();
  if (explicit) return explicit;
  if (typeof window === "undefined") return undefined;
  const last = sessionStorage.getItem(KURIOSA_LAST_RANDOM_SLUG_KEY)?.trim();
  if (last) return last;
  const daily = dailyTopicSlug?.trim();
  return daily || undefined;
}

export function writeLastRandomSlug(slug: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KURIOSA_LAST_RANDOM_SLUG_KEY, slug.trim());
}

/**
 * Action-triggered random curiosity fetch (not a cached query).
 * Caller should navigate on non-null result and handle null / errors in UI.
 */
export function useFeedRandomCuriosity() {
  return useMutation<
    LoadedCuriosityExperience | null,
    Error,
    FeedRandomCuriosityInput
  >({
    mutationKey: ["curiosity", "feed-random"],
    mutationFn: async (input) => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      const excludeSlug = readExcludeSlug(
        input.dailyTopicSlug,
        input.excludeSlug
      );
      const excludeTopicIds = user?.id
        ? await getCompletedTopicIds(supabase, user.id)
        : [];

      return getRandomCuriosity(supabase, {
        difficultyLevel: input.difficultyLevel?.trim() || undefined,
        categorySlug: input.categorySlug?.trim() || undefined,
        excludeSlug,
        excludeTopicIds: excludeTopicIds.length ? excludeTopicIds : undefined,
      });
    },
  });
}
