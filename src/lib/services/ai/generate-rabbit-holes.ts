/**
 * Phase 9 — Generate rabbit-hole suggestions for a topic/question.
 * Scaffolding: prompt → AI → parse → cache → moderation.
 */

import { buildRabbitHolePrompt } from "@/lib/ai/prompts/rabbit-hole-prompt";
import { runAICompletion } from "@/lib/ai/ai-client";
import { parseStringArray } from "@/lib/ai/parse-ai-response";
import { getOrSetAICache } from "@/lib/services/ai/get-or-set-ai-cache";
import { moderateAIResponse } from "@/lib/services/ai/moderate-ai-response";
import { checkAIRateLimit } from "@/lib/services/ai/ai-rate-limit";
import type { RabbitHoleGenerationInput } from "@/types/ai";

export type GenerateRabbitHolesResult =
  | { ok: true; suggestions: string[]; fromCache: boolean }
  | { ok: false; error: string };

function buildCacheKey(input: RabbitHoleGenerationInput): string {
  const base = `rabbitholes:${input.topicId}:${input.topicTitle.slice(0, 60)}`;
  const q = input.questionText?.slice(0, 60) ?? "";
  return q ? `${base}:${q}` : base;
}

export async function generateRabbitHoles(
  input: RabbitHoleGenerationInput,
  options?: { userId?: string }
): Promise<GenerateRabbitHolesResult> {
  if (options?.userId) {
    const limit = checkAIRateLimit(options.userId);
    if (!limit.allowed) {
      return { ok: false, error: "Rate limit exceeded. Try again shortly." };
    }
  }

  const cacheResult = await getOrSetAICache(buildCacheKey(input), async () => {
    const prompt = buildRabbitHolePrompt(input);
    const completion = await runAICompletion(prompt, { temperature: 0.7 });
    if (!completion.ok) {
      throw new Error(completion.error);
    }
    const parsed = parseStringArray(completion.text);
    if (!parsed.ok) {
      throw new Error(parsed.error);
    }
    const mod = await moderateAIResponse(parsed.value.join("\n"));
    if (!mod.ok || !mod.isSafe) {
      throw new Error("Moderation check failed");
    }
    return parsed.value;
  });

  if (!cacheResult.ok) {
    return { ok: false, error: cacheResult.error };
  }

  return {
    ok: true,
    suggestions: cacheResult.value,
    fromCache: cacheResult.fromCache,
  };
}
