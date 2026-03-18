import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProgressStatsView } from "@/types/progress-view";
import { fetchRewardedHistoryAggregate } from "@/lib/services/progress/read/progress-read-helpers";
import { getUserBadges } from "@/lib/services/progress/get-user-badges";

const RECENT_BADGE_LIMIT = 8;

/**
 * Topic/category counts, badge totals, recent unlocks.
 */
export async function getUserProgressStats(
  supabase: SupabaseClient,
  userId: string
): Promise<ProgressStatsView | null> {
  const uid = userId.trim();
  if (!uid) return null;

  const [agg, badges] = await Promise.all([
    fetchRewardedHistoryAggregate(supabase, uid),
    getUserBadges(supabase, uid),
  ]);

  if (!agg) return null;

  return {
    totalTopicsCompleted: agg.topicCount,
    categoriesExplored: agg.distinctCategoryCount,
    badgesEarned: badges.length,
    recentBadgeUnlocks: badges.slice(0, RECENT_BADGE_LIMIT),
    randomCompletionsCount: agg.randomCompletionsCount,
    perfectChallengesCount: agg.perfectChallengesCount,
  };
}
