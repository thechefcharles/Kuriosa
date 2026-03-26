/**
 * Phase 9.5 — Lightweight AI interaction analytics.
 * Fire-and-forget; failures must NOT break user experience.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";

export type AIInteractionEventType =
  | "guided_followup"
  | "manual"
  | "rabbit_hole";

export type RecordAIInteractionInput = {
  userId: string;
  topicId: string;
  eventType: AIInteractionEventType;
  questionText: string;
  fromCache: boolean;
  rateLimited: boolean;
  fallbackUsed: boolean;
  questionId?: string;
  answerId?: string;
};

/**
 * Record an AI interaction event. Non-blocking; swallows errors.
 * Call after we have the final result (success or fallback).
 */
export async function recordAIInteraction(
  input: RecordAIInteractionInput
): Promise<void> {
  const uid = input.userId?.trim();
  const tid = input.topicId?.trim();
  const q = input.questionText?.trim();

  if (!uid || !tid || !q) return;

  try {
    const supabase = getSupabaseServiceRoleClient();
    await supabase.from("ai_interaction_events").insert({
      user_id: uid,
      topic_id: tid,
      event_type: input.eventType,
      question_text: q,
      from_cache: input.fromCache,
      rate_limited: input.rateLimited,
      fallback_used: input.fallbackUsed,
      question_id: input.questionId || null,
      answer_id: input.answerId || null,
    });
  } catch {
    // Silent; analytics must never break UX
  }
}
