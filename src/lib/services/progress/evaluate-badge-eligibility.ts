/**
 * Loads user progress aggregates and returns badges that are eligible but not yet unlocked.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { BadgeDefinitionRow, BadgeEvaluationContext } from "@/lib/progress/badge-rules";
import {
  isBadgeEligible,
  isSupportedCriteriaType,
} from "@/lib/progress/badge-rules";

export type EligibleBadgeForUnlock = BadgeDefinitionRow;

export type BadgeEligibilityResult = {
  /** Badges the user qualifies for but did not have before this evaluation. */
  newlyEligible: EligibleBadgeForUnlock[];
  /** Slugs already in user_badges (for debugging). */
  alreadyUnlockedSlugs: string[];
};

async function loadBadgeDefinitions(
  supabase: SupabaseClient
): Promise<BadgeDefinitionRow[]> {
  const { data, error } = await supabase
    .from("badges")
    .select("id, slug, name, description, criteria_type, criteria_value");

  if (error || !data?.length) return [];
  return data as BadgeDefinitionRow[];
}

async function loadUnlockedState(
  supabase: SupabaseClient,
  userId: string
): Promise<
  | { ok: true; ids: Set<string>; slugs: string[] }
  | { ok: false; message: string }
> {
  const { data, error } = await supabase
    .from("user_badges")
    .select("badge_id")
    .eq("user_id", userId);

  if (error) {
    return { ok: false, message: error.message };
  }

  const ids = new Set(
    (data ?? []).map((r) => String((r as { badge_id: string }).badge_id))
  );

  if (!ids.size) {
    return { ok: true, ids, slugs: [] };
  }

  const { data: badgeRows, error: bErr } = await supabase
    .from("badges")
    .select("slug")
    .in("id", [...ids]);

  if (bErr) {
    return { ok: false, message: bErr.message };
  }

  const slugs = (badgeRows ?? []).map((b) => String((b as { slug: string }).slug));
  return { ok: true, ids, slugs };
}

function parseUtcDateOnly(iso: string): string {
  return iso.slice(0, 10);
}

function daysBetween(dateStrA: string, dateStrB: string): number {
  const a = new Date(dateStrA + "T12:00:00Z").getTime();
  const b = new Date(dateStrB + "T12:00:00Z").getTime();
  return Math.floor(Math.abs(b - a) / (24 * 60 * 60 * 1000));
}

const ADVANCED_LEVELS = new Set(["intermediate", "advanced", "expert"]);

async function buildEvaluationContext(
  supabase: SupabaseClient,
  userId: string,
  completedAtIso: string | null
): Promise<BadgeEvaluationContext | null> {
  const { data: profile, error: pErr } = await supabase
    .from("profiles")
    .select("current_streak, longest_streak, last_active_date")
    .eq("id", userId)
    .maybeSingle();

  if (pErr || !profile) return null;

  const { data: rows, error: hErr } = await supabase
    .from("user_topic_history")
    .select("topic_id, was_random_spin, challenge_correct, completed_at")
    .eq("user_id", userId)
    .eq("rewards_granted", true)
    .not("completed_at", "is", null);

  if (hErr) return null;

  const history = rows ?? [];
  const topicsCompleted = history.length;
  const randomCompletionCount = history.filter((r) => r.was_random_spin).length;
  const quizzesCompleted = history.filter(
    (r) =>
      r.challenge_correct !== null && r.challenge_correct !== undefined
  ).length;
  const perfectChallengeCount = history.filter(
    (r) => r.challenge_correct === true
  ).length;

  const topicIds = [...new Set(history.map((r) => String(r.topic_id)))];
  const completionsByCategorySlug: Record<string, number> = {};
  let categoriesExplored = 0;
  let maxCategoriesInOneDay = 0;
  let advancedInRowMax = 0;

  if (topicIds.length) {
    const { data: topics } = await supabase
      .from("topics")
      .select("id, category_id, difficulty_level")
      .in("id", topicIds);

    const catIds = [
      ...new Set((topics ?? []).map((t) => String(t.category_id))),
    ];
    const { data: categories } = await supabase
      .from("categories")
      .select("id, slug")
      .in("id", catIds);

    const catIdToSlug = new Map(
      (categories ?? []).map((c) => [
        String((c as { id: string }).id),
        String((c as { slug: string }).slug).toLowerCase(),
      ])
    );

    const topicToSlug = new Map(
      (topics ?? []).map((t) => [
        String(t.id),
        catIdToSlug.get(String(t.category_id)) ?? "unknown",
      ])
    );

    const topicToDifficulty = new Map(
      (topics ?? []).map((t) => [
        String(t.id),
        String((t as { difficulty_level?: string | null }).difficulty_level ?? "").toLowerCase(),
      ])
    );

    const distinctCats = new Set<string>();
    const byDate = new Map<string, Set<string>>();

    for (const row of history) {
      const slug = topicToSlug.get(String(row.topic_id));
      if (slug) {
        distinctCats.add(slug);
        completionsByCategorySlug[slug] =
          (completionsByCategorySlug[slug] ?? 0) + 1;
      }
      const completedAt = (row as { completed_at?: string | null }).completed_at;
      if (completedAt && slug) {
        const d = parseUtcDateOnly(completedAt);
        if (!byDate.has(d)) byDate.set(d, new Set());
        byDate.get(d)!.add(slug);
      }
    }
    categoriesExplored = distinctCats.size;

    for (const cats of byDate.values()) {
      maxCategoriesInOneDay = Math.max(maxCategoriesInOneDay, cats.size);
    }

    const sorted = [...history]
      .filter((r) => (r as { completed_at?: string }).completed_at)
      .sort(
        (a, b) =>
          new Date((b as { completed_at: string }).completed_at).getTime() -
          new Date((a as { completed_at: string }).completed_at).getTime()
      );

    let run = 0;
    for (const row of sorted) {
      const diff = topicToDifficulty.get(String(row.topic_id)) ?? "";
      if (ADVANCED_LEVELS.has(diff)) {
        run++;
        advancedInRowMax = Math.max(advancedInRowMax, run);
      } else {
        run = 0;
      }
    }
  }

  let comebackGapDays = 0;
  if (completedAtIso && profile.last_active_date) {
    const completedDate = parseUtcDateOnly(completedAtIso);
    const lastDate = String(profile.last_active_date).slice(0, 10);
    const diff = daysBetween(lastDate, completedDate);
    if (diff > 1) comebackGapDays = diff;
  }

  return {
    topicsCompleted,
    currentStreak: Number(profile.current_streak) || 0,
    longestStreak: Number(profile.longest_streak) || 0,
    categoriesExplored,
    quizzesCompleted,
    perfectChallengeCount,
    randomCompletionCount,
    completionsByCategorySlug,
    maxCategoriesInOneDay,
    comebackGapDays,
    advancedInRowMax,
  };
}

/**
 * Determines which badge definitions the user newly qualifies for (excluding already unlocked).
 * @param completedAtIso - Optional. When provided (e.g. from completion flow), used for comeback_gap.
 */
export async function evaluateBadgeEligibility(
  supabase: SupabaseClient,
  userId: string,
  completedAtIso?: string | null
): Promise<BadgeEligibilityResult | { error: string }> {
  const uid = userId.trim();
  if (!uid) return { error: "Missing user id" };

  const [definitions, unlocked, ctx] = await Promise.all([
    loadBadgeDefinitions(supabase),
    loadUnlockedState(supabase, uid),
    buildEvaluationContext(supabase, uid, completedAtIso ?? null),
  ]);

  if (!unlocked.ok) {
    return { error: `user_badges: ${unlocked.message}` };
  }

  if (!ctx) {
    return { error: "Could not load profile or history for badge evaluation" };
  }

  const newlyEligible: EligibleBadgeForUnlock[] = [];

  for (const def of definitions) {
    if (!isSupportedCriteriaType(def.criteria_type)) continue;
    if (unlocked.ids.has(def.id)) continue;
    if (isBadgeEligible(def, ctx)) {
      newlyEligible.push(def);
    }
  }

  return {
    newlyEligible,
    alreadyUnlockedSlugs: [...new Set(unlocked.slugs)].sort(),
  };
}
