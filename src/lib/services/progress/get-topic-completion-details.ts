/**
 * Fetches completion details (xpEarned, challengeCorrect) for a topic when the user has completed it.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export type TopicCompletionDetails = {
  xpEarned: number;
  challengeCorrect: boolean;
};

export async function getTopicCompletionDetails(
  supabase: SupabaseClient,
  userId: string,
  topicId: string
): Promise<TopicCompletionDetails | null> {
  const uid = userId.trim();
  const tid = topicId.trim();
  if (!uid || !tid) return null;

  const { data, error } = await supabase
    .from("user_topic_history")
    .select("xp_earned, challenge_correct")
    .eq("user_id", uid)
    .eq("topic_id", tid)
    .eq("rewards_granted", true)
    .maybeSingle();

  if (error || !data) return null;

  const xp = (data as { xp_earned?: number | null }).xp_earned;
  const correct = (data as { challenge_correct?: boolean | null }).challenge_correct;

  if (xp == null || !Number.isFinite(Number(xp))) return null;

  return {
    xpEarned: Math.max(0, Math.round(Number(xp))),
    challengeCorrect: correct === true,
  };
}
