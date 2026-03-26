/**
 * Runs badge eligibility + unlock after a rewarded completion. Keeps the main processor thin.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { evaluateBadgeEligibility } from "@/lib/services/progress/evaluate-badge-eligibility";
import { unlockBadges } from "@/lib/services/progress/unlock-badges";
import type { UnlockedBadgeResult } from "@/types/progress";

export type ApplyCompletionBadgesOutcome = {
  unlockedBadges: UnlockedBadgeResult[];
  warnings: string[];
};

export type CompletionBadgeContext = {
  hitLuckyMultiplier?: boolean;
};

export async function applyCompletionBadgeUnlocks(
  supabase: SupabaseClient,
  userId: string,
  completedAtIso?: string | null,
  completionContext?: CompletionBadgeContext
): Promise<ApplyCompletionBadgesOutcome> {
  const warnings: string[] = [];

  const evalResult = await evaluateBadgeEligibility(
    supabase,
    userId,
    completedAtIso,
    completionContext
  );
  if ("error" in evalResult) {
    warnings.push(`Badge evaluation skipped: ${evalResult.error}`);
    return { unlockedBadges: [], warnings };
  }

  const unlock = await unlockBadges(supabase, userId, evalResult.newlyEligible);
  if (!unlock.ok) {
    warnings.push(`Badge unlock failed: ${unlock.message}`);
    return { unlockedBadges: [], warnings };
  }

  return { unlockedBadges: unlock.newlyUnlocked, warnings };
}
