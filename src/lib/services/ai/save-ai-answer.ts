/**
 * Phase 9 — Persist AI answer to ai_answers.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import type { PersistedAIAnswerResult } from "@/types/ai";

/**
 * Insert an answer. Call only after successful generation/moderation.
 */
export async function saveAIAnswer(
  questionId: string,
  answerText: string,
  options?: { model?: string; tokensUsed?: number }
): Promise<PersistedAIAnswerResult> {
  const qid = questionId.trim();
  const text = answerText.trim();

  if (!qid || !text) {
    return { ok: false, error: "questionId and answerText are required" };
  }

  try {
    const supabase = getSupabaseServiceRoleClient();

    const row: Record<string, unknown> = {
      question_id: qid,
      answer_text: text,
    };
    if (options?.model) row.model = options.model;
    if (options?.tokensUsed != null) row.tokens_used = options.tokensUsed;

    const { data, error } = await supabase
      .from("ai_answers")
      .insert(row)
      .select("id")
      .single();

    if (error) return { ok: false, error: error.message };
    return { ok: true, answerId: String(data.id) };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
