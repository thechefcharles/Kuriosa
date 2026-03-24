/**
 * Phase 9 — Generate follow-up questions for a topic.
 * Pure generator: prompt → AI → parse → moderation.
 * Storage handled by getTopicFollowups (ai_followups).
 */

import { buildFollowupPrompt } from "@/lib/ai/prompts/followup-prompt";
import { runAICompletion } from "@/lib/ai/ai-client";
import { parseStringArray } from "@/lib/ai/parse-ai-response";
import { moderateAIResponse } from "@/lib/services/ai/moderate-ai-response";
import { checkAIRateLimit } from "@/lib/services/ai/ai-rate-limit";
import type { FollowupGenerationInput } from "@/types/ai";

export type GenerateFollowupsResult =
  | { ok: true; questions: string[] }
  | { ok: false; error: string };

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

  const prompt = buildFollowupPrompt(input);
  const completion = await runAICompletion(prompt, { temperature: 0.7 });
  if (!completion.ok) {
    return { ok: false, error: completion.error };
  }

  const parsed = parseStringArray(completion.text);
  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  const mod = await moderateAIResponse(parsed.value.join("\n"));
  if (!mod.ok || !mod.isSafe) {
    return { ok: false, error: "Moderation check failed" };
  }

  return { ok: true, questions: parsed.value };
}
