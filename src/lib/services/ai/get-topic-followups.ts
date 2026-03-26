/**
 * Phase 9 — Get or generate topic follow-up questions.
 * ai_followups is canonical. Prefer stored results before regenerating.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { loadTopicAIContext } from "@/lib/services/ai/load-topic-ai-context";
import { generateFollowups } from "@/lib/services/ai/generate-followups";
import { saveTopicFollowups } from "@/lib/services/ai/save-topic-followups";
import type { TopicFollowupResult } from "@/types/ai";

export type GetTopicFollowupsInput =
  | { topicId: string; slug?: never }
  | { slug: string; topicId?: never };

export type GetTopicFollowupsOptions = { userId?: string };

/**
 * Get follow-up questions for a topic.
 * 1. Check ai_followups
 * 2. If found → return
 * 3. If not → load context, generate, persist, return
 */
export async function getTopicFollowups(
  input: GetTopicFollowupsInput,
  options?: GetTopicFollowupsOptions
): Promise<TopicFollowupResult> {
  const context = await loadTopicAIContext(input);
  if (!context) {
    return { ok: false, error: "Topic not found" };
  }

  const supabase = getSupabaseServiceRoleClient();

  const { data: stored, error: fetchErr } = await supabase
    .from("ai_followups")
    .select("questions, created_at")
    .eq("topic_id", context.topicId)
    .maybeSingle();

  if (fetchErr) {
    return { ok: false, error: fetchErr.message };
  }

  if (stored?.questions && Array.isArray(stored.questions)) {
    const questions = (stored.questions as string[])
      .filter((q): q is string => typeof q === "string")
      .map((q) => String(q).trim())
      .filter(Boolean);

    if (questions.length > 0) {
      return {
        ok: true,
        questions,
        fromStorage: true,
        topicId: context.topicId,
      };
    }
  }

  const gen = await generateFollowups(
    {
      topicId: context.topicId,
      topicTitle: context.title,
      lessonExcerpt: context.lessonExcerpt,
    },
    { userId: options?.userId }
  );

  if (!gen.ok) {
    return { ok: false, error: gen.error };
  }

  const save = await saveTopicFollowups(context.topicId, gen.questions);
  if (!save.ok) {
    return { ok: false, error: save.error };
  }

  return {
    ok: true,
    questions: gen.questions,
    fromStorage: false,
    topicId: context.topicId,
  };
}
