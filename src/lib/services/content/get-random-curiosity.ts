/**
 * Picks a random published topic and loads its experience.
 *
 * - Prefers topics with is_random_featured = true when any exist (after filters).
 * - Optional difficulty_level filter.
 * - excludeSlug avoids immediate repeat when another topic exists.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { loadCuriosityExperience } from "@/lib/services/content/load-curiosity-experience";

export type GetRandomCuriosityOptions = {
  difficultyLevel?: string;
  /** If set, excluded from the candidate pool when alternatives exist */
  excludeSlug?: string;
};

async function fetchCandidateIds(
  supabase: SupabaseClient,
  opts: GetRandomCuriosityOptions & { featuredOnly: boolean }
): Promise<{ id: string; slug: string }[]> {
  let q = supabase
    .from("topics")
    .select("id, slug")
    .eq("status", "published");

  if (opts.difficultyLevel?.trim()) {
    q = q.eq("difficulty_level", opts.difficultyLevel.trim());
  }
  if (opts.excludeSlug?.trim()) {
    q = q.neq("slug", opts.excludeSlug.trim());
  }
  if (opts.featuredOnly) {
    q = q.eq("is_random_featured", true);
  }

  const { data, error } = await q.limit(100);
  if (error || !data?.length) return [];
  return data as { id: string; slug: string }[];
}

function pickRandom<T>(items: T[]): T | null {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)]!;
}

/**
 * Returns null if no published topics match filters.
 */
export async function getRandomCuriosity(
  supabase: SupabaseClient,
  options: GetRandomCuriosityOptions = {}
): Promise<LoadedCuriosityExperience | null> {
  let pool = await fetchCandidateIds(supabase, {
    ...options,
    featuredOnly: true,
  });

  if (!pool.length) {
    pool = await fetchCandidateIds(supabase, {
      ...options,
      featuredOnly: false,
    });
  }

  if (!pool.length && options.excludeSlug?.trim()) {
    pool = await fetchCandidateIds(supabase, {
      difficultyLevel: options.difficultyLevel,
      excludeSlug: undefined,
      featuredOnly: true,
    });
    if (!pool.length) {
      pool = await fetchCandidateIds(supabase, {
        difficultyLevel: options.difficultyLevel,
        featuredOnly: false,
      });
    }
  }

  const chosen = pickRandom(pool);
  if (!chosen) return null;

  return loadCuriosityExperience(supabase, { topicId: chosen.id });
}
