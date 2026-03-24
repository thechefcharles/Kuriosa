/**
 * Phase 9 — Get rabbit-hole suggestions for a topic.
 * Uses ai_cache. Loads context, generates 3–5 suggestions if miss.
 */

import { loadTopicAIContext } from "@/lib/services/ai/load-topic-ai-context";
import { generateRabbitHoles } from "@/lib/services/ai/generate-rabbit-holes";
import type { RabbitHoleSuggestionResult } from "@/types/ai";

export type GetTopicRabbitHolesInput =
  | { topicId: string; slug?: never }
  | { slug: string; topicId?: never };

export type GetTopicRabbitHolesOptions = {
  /** Optional question that triggered the request (e.g. user's follow-up) */
  questionText?: string | null;
  userId?: string;
};

/**
 * Get rabbit-hole suggestions for a topic.
 * Cached in ai_cache. Key: topic + optional question hash.
 */
export async function getTopicRabbitHoles(
  input: GetTopicRabbitHolesInput,
  options?: GetTopicRabbitHolesOptions
): Promise<RabbitHoleSuggestionResult> {
  const context = await loadTopicAIContext(input);
  if (!context) {
    return { ok: false, error: "Topic not found" };
  }

  const result = await generateRabbitHoles(
    {
      topicId: context.topicId,
      topicTitle: context.title,
      questionText: options?.questionText ?? undefined,
      lessonExcerpt: context.lessonExcerpt,
    },
    { userId: options?.userId }
  );

  if (!result.ok) {
    return { ok: false, error: result.error };
  }

  const items = result.suggestions.map((title) => ({
    title,
    reasonText: undefined as string | undefined,
  }));

  return {
    ok: true,
    suggestions: items,
    fromCache: result.fromCache,
    topicId: context.topicId,
  };
}
