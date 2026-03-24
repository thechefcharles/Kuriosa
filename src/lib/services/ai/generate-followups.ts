/**
 * Phase 9 — Generate follow-up questions for a topic.
 * Scaffolding: prompt → AI → parse → cache → moderation.
 */

import { buildFollowupPrompt } from "@/lib/ai/prompts/followup-prompt";
import { runAICompletion } from "@/lib/ai/ai-client";
import { parseStringArray } from "@/lib/ai/parse-ai-response";
import { getOrSetAICache } from "@/lib/services/ai/get-or-set-ai-cache";
import { moderateAIResponse } from "@/lib/services/ai/moderate-ai-response";
import { checkAIRateLimit } from "@/lib/services/ai/ai-rate-limit";
import type { FollowupGenerationInput } from "@/types/ai";

export type GenerateFollowupsResult =
  | { ok: true; questions: string[]; fromCache: boolean }
  | { ok: false; error: string };

function buildCacheKey(input: FollowupGenerationInput): string {
  return `followups:${input.topicId}:${input.topicTitle.slice(0, 80)}`;
}

export async function generateFollowups(
  input: FollowupGenerationInput,
  options?: { userId?: string }
): Promise<GenerateFollowupsResult> {
  if (options?.userId) {
    const limit = checkAIRateLimit(options.userId);
    if (!limit.allowed) {
      return { ok: false, error: "Rate limit exceeded. Try again shortly." };
    }
  }

  const cacheResult = await getOrSetAICache(buildCacheKey(input), async () => {
    const prompt = buildFollowupPrompt(input);
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
    questions: cacheResult.value,
    fromCache: cacheResult.fromCache,
  };
}
