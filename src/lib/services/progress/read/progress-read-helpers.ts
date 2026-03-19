/**
 * Shared reads for progress view services (rewarded history aggregates).
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type RewardedHistoryAggregate = {
  topicIds: string[];
  topicCount: number;
  distinctCategoryCount: number;
  randomCompletionsCount: number;
  perfectChallengesCount: number;
};

export async function fetchRewardedHistoryAggregate(
  supabase: SupabaseClient,
  userId: string
): Promise<RewardedHistoryAggregate | null> {
  const { data: rows, error } = await supabase
    .from("user_topic_history")
    .select("topic_id, was_random_spin, challenge_correct")
    .eq("user_id", userId)
    .eq("rewards_granted", true);

  if (error) return null;

  const history = rows ?? [];
  const topicIds = [...new Set(history.map((r) => String(r.topic_id)))];
  const randomCompletionsCount = history.filter((r) => r.was_random_spin).length;
  const perfectChallengesCount = history.filter(
    (r) => r.challenge_correct === true
  ).length;

  if (!topicIds.length) {
    return {
      topicIds: [],
      topicCount: 0,
      distinctCategoryCount: 0,
      randomCompletionsCount,
      perfectChallengesCount,
    };
  }

  const { data: topics, error: tErr } = await supabase
    .from("topics")
    .select("category_id")
    .in("id", topicIds);

  if (tErr) return null;

  const distinctCategoryCount = new Set(
    (topics ?? []).map((t) => String(t.category_id))
  ).size;

  return {
    topicIds,
    topicCount: history.length,
    distinctCategoryCount,
    randomCompletionsCount,
    perfectChallengesCount,
  };
}
