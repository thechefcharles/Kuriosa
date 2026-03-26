/**
 * Phase 9 — Generate answer to a user question.
 * Scaffolding: prompt → AI → parse → moderation → (no cache for answers; store in DB later).
 */

import { buildAnswerPrompt } from "@/lib/ai/prompts/answer-prompt";
import { runAICompletion } from "@/lib/ai/ai-client";
import { parseText } from "@/lib/ai/parse-ai-response";
import { moderateAIResponse } from "@/lib/services/ai/moderate-ai-response";
import { checkAIRateLimit } from "@/lib/services/ai/ai-rate-limit";
import type { AnswerGenerationInput } from "@/types/ai";

export type GenerateAnswerResult =
  | { ok: true; answerText: string; model?: string; tokensUsed?: number }
  | { ok: false; error: string };

export async function generateAnswer(
  input: AnswerGenerationInput,
  options: { userId: string }
): Promise<GenerateAnswerResult> {
  const limit = checkAIRateLimit(options.userId);
  if (!limit.allowed) {
    return { ok: false, error: "Rate limit exceeded. Try again shortly." };
  }

  const prompt = buildAnswerPrompt(input);
  const completion = await runAICompletion(prompt, {
    temperature: 0.6,
    maxTokens: 600,
  });

  if (!completion.ok) {
    return { ok: false, error: completion.error };
  }

  const parsed = parseText(completion.text);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  const mod = await moderateAIResponse(parsed.value);
  if (!mod.ok) {
    return { ok: false, error: "Moderation check failed" };
  }
  if (!mod.isSafe) {
    return { ok: false, error: "Response did not pass safety check" };
  }

  return {
    ok: true,
    answerText: parsed.value,
    model: completion.model,
    tokensUsed: completion.usage?.promptTokens != null && completion.usage?.completionTokens != null
      ? completion.usage.promptTokens + completion.usage.completionTokens
      : undefined,
  };
}
