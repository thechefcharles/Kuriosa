/**
 * Phase 9 — Manual curiosity question answering.
 * Main service: normalize → load context → cache check → rate limit → generate → moderate → persist → return.
 */

import { loadTopicAIContext } from "@/lib/services/ai/load-topic-ai-context";
import { normalizeManualQuestion } from "@/lib/services/ai/normalize-manual-question";
import { manualAnswerCacheKey } from "@/lib/services/ai/ai-cache-keys";
import { getOrSetAICache } from "@/lib/services/ai/get-or-set-ai-cache";
import { checkAIRateLimit } from "@/lib/services/ai/ai-rate-limit";
import { generateAnswer } from "@/lib/services/ai/generate-answer";
import { saveAIQuestion } from "@/lib/services/ai/save-ai-question";
import { saveAIAnswer } from "@/lib/services/ai/save-ai-answer";
import { getFallbackResponse } from "@/lib/services/ai/ai-fallback-responses";
import type { ManualQuestionInput, ManualQuestionResult } from "@/types/ai";

type CachedAnswer = { answerText: string };

/**
 * Answer a manual curiosity question. Topic-scoped, cached, moderated, rate-limited.
 */
export async function answerManualQuestion(
  input: ManualQuestionInput
): Promise<ManualQuestionResult> {
  const norm = normalizeManualQuestion(input.questionText);
  if (!norm.ok) {
    return {
      ok: false,
      moderated: false,
      rateLimited: false,
      fallbackUsed: false,
      error: norm.error,
    };
  }

  const normalizedQuestion = norm.normalized;

  const context = await loadTopicAIContext(
    input.topicId ? { topicId: input.topicId } : { slug: input.slug! }
  );

  if (!context) {
    return {
      ok: false,
      question: normalizedQuestion,
      moderated: false,
      rateLimited: false,
      fallbackUsed: false,
      error: "Topic not found",
    };
  }

  const cacheKey = manualAnswerCacheKey(context.topicId, normalizedQuestion);

  const limit = checkAIRateLimit(input.userId);
  if (!limit.allowed) {
    return {
      ok: false,
      question: normalizedQuestion,
      answerText: getFallbackResponse("rateLimitExceeded"),
      moderated: false,
      rateLimited: true,
      fallbackUsed: true,
      error: "Rate limit exceeded",
    };
  }

  let persistedQuestionId: string | undefined;
  let persistedAnswerId: string | undefined;

  const cacheResult = await getOrSetAICache<CachedAnswer>(cacheKey, async () => {
    const gen = await generateAnswer(
      {
        topicId: context.topicId,
        topicTitle: context.title,
        questionText: normalizedQuestion,
        lessonContext: context.lessonExcerpt,
        categoryName: context.categoryName,
      },
      { userId: input.userId }
    );

    if (!gen.ok) {
      const err = gen.error.toLowerCase();
      const fallback =
        err.includes("rate limit")
          ? getFallbackResponse("rateLimitExceeded")
          : err.includes("timeout")
            ? getFallbackResponse("timeout")
            : err.includes("moderation") || err.includes("safety")
              ? getFallbackResponse("moderationFailed")
              : getFallbackResponse("generationFailed");
      throw new Error(fallback);
    }

    const qSave = await saveAIQuestion(
      input.userId,
      context.topicId,
      normalizedQuestion
    );
    if (qSave.ok) {
      persistedQuestionId = qSave.questionId;
      const aSave = await saveAIAnswer(
        qSave.questionId,
        gen.answerText,
        { model: gen.model, tokensUsed: gen.tokensUsed }
      );
      if (aSave.ok) persistedAnswerId = aSave.answerId;
    }

    return { answerText: gen.answerText };
  });

  if (!cacheResult.ok) {
    const fallback = getFallbackResponse("generationFailed");
    return {
      ok: false,
      question: normalizedQuestion,
      answerText: fallback,
      moderated: false,
      rateLimited: false,
      fallbackUsed: true,
      error: cacheResult.error,
    };
  }

  return {
    ok: true,
    question: normalizedQuestion,
    answerText: cacheResult.value.answerText,
    fromCache: cacheResult.fromCache,
    moderated: true,
    rateLimited: false,
    fallbackUsed: false,
    questionId: persistedQuestionId,
    answerId: persistedAnswerId,
  };
}
