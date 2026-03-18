/**
 * Trail generation: structured next-topic candidates. Server-side only.
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";
import { buildTrailMessages } from "@/lib/ai/prompts/trail-prompts";
import { parseTrailResponse } from "@/lib/ai/parsers/trail-parser";
import type {
  GeneratedTrailContent,
  GeneratedTrailRequestOptions,
} from "@/types/content-generation";

export type GenerateTrailsResult =
  | { success: true; content: GeneratedTrailContent }
  | { success: false; error: string; details?: unknown };

const DEFAULT_MODEL = "gpt-4o-mini";

export async function generateTrails(
  options: GeneratedTrailRequestOptions
): Promise<GenerateTrailsResult> {
  try {
    const client = getOpenAIClient();
    const messages = buildTrailMessages(options);

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

    const parsed = parseTrailResponse(text, {
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
      error: "Unknown error during trail generation",
      details: err,
    };
  }
}
