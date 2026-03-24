/**
 * Phase 9 — Persist follow-up questions to ai_followups.
 * One active set per topic (upsert by topic_id).
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";

export type SaveTopicFollowupsResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Insert or upsert follow-up questions for a topic.
 * Keeps only one active set per topic for MVP.
 */
export async function saveTopicFollowups(
  topicId: string,
  questions: string[]
): Promise<SaveTopicFollowupsResult> {
  const id = topicId.trim();
  if (!id) return { ok: false, error: "Topic ID is required." };

  const valid = questions
    .filter((q): q is string => typeof q === "string")
    .map((q) => String(q).trim())
    .filter(Boolean);

  try {
    const supabase = getSupabaseServiceRoleClient();

    const { error } = await supabase.from("ai_followups").upsert(
      {
        topic_id: id,
        questions: valid,
      },
      { onConflict: "topic_id" }
    );

    if (error) return { ok: false, error: error.message };
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
