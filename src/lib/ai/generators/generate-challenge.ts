/**
 * Challenge generation: OpenAI → prompts → parse → Zod-validated pack.
 * Server-side only.
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";
import { buildChallengeMessages } from "@/lib/ai/prompts/challenge-prompts";
import { parseChallengeResponse } from "@/lib/ai/parsers/challenge-parser";
import type {
  GeneratedChallengeContent,
  GeneratedChallengeRequestOptions,
} from "@/types/content-generation";

export type GenerateChallengeResult =
  | { success: true; challenge: GeneratedChallengeContent }
  | { success: false; error: string; details?: unknown };

const DEFAULT_MODEL = "gpt-4o-mini";

export async function generateChallenge(
  options: GeneratedChallengeRequestOptions
): Promise<GenerateChallengeResult> {
  try {
    const client = getOpenAIClient();
    const messages = buildChallengeMessages(options);

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return {
        success: false,
        error: "Empty or invalid API response",
        details: response,
      };
    }

    const parsed = parseChallengeResponse(content);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
        details: parsed.details,
      };
    }

    return { success: true, challenge: parsed.challenge };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("OPENAI_API_KEY")) {
        return { success: false, error: err.message };
      }
      return {
        success: false,
        error: err.message,
        details: err,
      };
    }
    return {
      success: false,
      error: "Unknown error during challenge generation",
      details: err,
    };
  }
}
