/**
 * Phase 9 — Persist manual question to ai_questions.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import type { PersistedAIQuestionResult } from "@/types/ai";

/**
 * Insert a manual question. Call only after successful generation/moderation.
 */
export async function saveAIQuestion(
  userId: string,
  topicId: string,
  questionText: string
): Promise<PersistedAIQuestionResult> {
  const uid = userId.trim();
  const tid = topicId.trim();
  const q = questionText.trim();

  if (!uid || !tid || !q) {
    return { ok: false, error: "userId, topicId, and questionText are required" };
  }

  try {
    const supabase = getSupabaseServiceRoleClient();

    const { data, error } = await supabase
      .from("ai_questions")
      .insert({
        user_id: uid,
        topic_id: tid,
        question_text: q,
        source: "manual",
      })
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, questionId: String(data.id) };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
