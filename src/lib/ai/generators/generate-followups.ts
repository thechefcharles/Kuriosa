/**
 * Follow-up generation: OpenAI → prompts → parse → Zod-validated list.
 * Server-side only. Pre-generated suggested Q&A only (not live user Q&A).
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";
import { buildFollowupMessages } from "@/lib/ai/prompts/followup-prompts";
import { parseFollowupResponse } from "@/lib/ai/parsers/followup-parser";
import type {
  GeneratedFollowupContent,
  GeneratedFollowupRequestOptions,
} from "@/types/content-generation";

export type GenerateFollowupsResult =
  | { success: true; content: GeneratedFollowupContent }
  | { success: false; error: string; details?: unknown };

const DEFAULT_MODEL = "gpt-4o-mini";

export async function generateFollowups(
  options: GeneratedFollowupRequestOptions
): Promise<GenerateFollowupsResult> {
  try {
    const client = getOpenAIClient();
    const messages = buildFollowupMessages(options);

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      response_format: { type: "json_object" },
    });

    const text = response.choices[0]?.message?.content;
    if (!text || typeof text !== "string") {
      return {
        success: false,
        error: "Empty or invalid API response",
        details: response,
      };
    }

    const parsed = parseFollowupResponse(text, {
      desiredCount: options.desiredCount,
    });
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
        details: parsed.details,
      };
    }

    return { success: true, content: parsed.content };
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
      error: "Unknown error during follow-up generation",
      details: err,
    };
  }
}
