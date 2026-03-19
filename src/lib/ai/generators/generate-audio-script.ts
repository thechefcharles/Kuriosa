/**
 * Audio narration script generation. No TTS or storage. Server-side only.
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";
import { buildAudioScriptMessages } from "@/lib/ai/prompts/audio-prompts";
import { parseAudioScriptResponse } from "@/lib/ai/parsers/audio-parser";
import type {
  GeneratedAudioContent,
  GeneratedAudioRequestOptions,
} from "@/types/content-generation";

export type GenerateAudioScriptResult =
  | { success: true; content: GeneratedAudioContent }
  | { success: false; error: string; details?: unknown };

const DEFAULT_MODEL = "gpt-4o-mini";

export async function generateAudioScript(
  options: GeneratedAudioRequestOptions
): Promise<GenerateAudioScriptResult> {
  try {
    const client = getOpenAIClient();
    const messages = buildAudioScriptMessages(options);

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

    const parsed = parseAudioScriptResponse(text);
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
      error: "Unknown error during audio script generation",
      details: err,
    };
  }
}
