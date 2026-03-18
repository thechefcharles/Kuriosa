/**
 * Persists badge unlocks idempotently (UNIQUE user_id + badge_id).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import type { EligibleBadgeForUnlock } from "@/lib/services/progress/evaluate-badge-eligibility";
import type { UnlockedBadgeResult } from "@/types/progress";

export type UnlockBadgesResult =
  | { ok: true; newlyUnlocked: UnlockedBadgeResult[] }
  | { ok: false; message: string };

/**
 * Inserts user_badges for each eligible definition. Skips duplicates via DB unique constraint.
 */
export async function unlockBadges(
  supabase: SupabaseClient,
  userId: string,
  eligible: EligibleBadgeForUnlock[]
): Promise<UnlockBadgesResult> {
  const uid = userId.trim();
  if (!uid) return { ok: false, message: "Missing user id" };

  if (!eligible.length) {
    return { ok: true, newlyUnlocked: [] };
  }

  const earnedAt = new Date().toISOString();
  const newlyUnlocked: UnlockedBadgeResult[] = [];

  for (const def of eligible) {
    const { data, error } = await supabase
      .from("user_badges")
      .insert({
        user_id: uid,
        badge_id: def.id,
        earned_at: earnedAt,
      })
      .select("earned_at")
      .maybeSingle();

    if (error) {
      if (error.code === "23505") {
        continue;
      }
      return { ok: false, message: error.message };
    }

    if (data) {
      newlyUnlocked.push({
        badgeId: def.id,
        slug: def.slug,
        name: def.name,
        description: def.description,
        earnedAt: String((data as { earned_at: string }).earned_at ?? earnedAt),
      });
    }
  }

  return { ok: true, newlyUnlocked };
}
