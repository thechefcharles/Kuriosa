/**
 * Phase 9 — Guided topic exploration service facade.
 * Single entrypoint: load context, follow-ups, rabbit holes.
 */

import { loadTopicAIContext } from "@/lib/services/ai/load-topic-ai-context";
import { getTopicFollowups } from "@/lib/services/ai/get-topic-followups";
import { getTopicRabbitHoles } from "@/lib/services/ai/get-topic-rabbit-holes";
import type { GuidedTopicExplorationResult } from "@/types/ai";

export type GetGuidedExplorationInput =
  | { topicId: string; slug?: never }
  | { slug: string; topicId?: never };

export type GetGuidedExplorationOptions = {
  questionText?: string | null;
  userId?: string;
};

/**
 * Load topic context, follow-ups, and rabbit holes in one call.
 * Convenience facade for later UI integration.
 */
export async function getGuidedTopicExploration(
  input: GetGuidedExplorationInput,
  options?: GetGuidedExplorationOptions
): Promise<GuidedTopicExplorationResult> {
  const context = await loadTopicAIContext(input);
  if (!context) {
    return { ok: false, error: "Topic not found" };
  }

  const [followupsResult, rabbitHolesResult] = await Promise.all([
    getTopicFollowups({ topicId: context.topicId }, { userId: options?.userId }),
    getTopicRabbitHoles(
      { topicId: context.topicId },
      { questionText: options?.questionText, userId: options?.userId }
    ),
  ]);

  if (!followupsResult.ok) {
    return { ok: false, error: followupsResult.error };
  }

  if (!rabbitHolesResult.ok) {
    return { ok: false, error: rabbitHolesResult.error };
  }

  return {
    ok: true,
    topicContext: context,
    followups: followupsResult.questions,
    followupsFromStorage: followupsResult.fromStorage,
    rabbitHoles: rabbitHolesResult.suggestions,
    rabbitHolesFromCache: rabbitHolesResult.fromCache,
  };
}
