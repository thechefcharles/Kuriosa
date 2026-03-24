/**
 * Fetches topic IDs the user has completed (rewards_granted) for completion badges and exclusion.
 */

import type { SupabaseClient } from "@supabase/supabase-js";

export async function getCompletedTopicIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const uid = userId.trim();
  if (!uid) return [];

  const { data, error } = await supabase
    .from("user_topic_history")
    .select("topic_id")
    .eq("user_id", uid)
    .eq("rewards_granted", true);

  if (error || !data?.length) return [];

  return [...new Set(data.map((r) => String((r as { topic_id: string }).topic_id)))];
}
