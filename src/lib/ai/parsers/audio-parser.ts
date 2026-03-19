/**
 * Parse and validate audio script generation API responses.
 */

import type {
  GeneratedAudioContent,
  GeneratedAudioScript,
} from "@/types/content-generation";
import { generatedAudioContentSchema } from "@/lib/validations/generated-audio";

export type AudioParseResult =
  | { success: true; content: GeneratedAudioContent }
  | { success: false; error: string; details?: unknown };

export function parseAudioScriptResponse(raw: unknown): AudioParseResult {
  let json: unknown;
  if (typeof raw === "string") {
    try {
      json = JSON.parse(raw) as unknown;
    } catch {
      return { success: false, error: "Invalid JSON in audio script response" };
    }
  } else if (raw != null && typeof raw === "object") {
    json = raw;
  } else {
    return { success: false, error: "Invalid response: expected JSON string or object" };
  }

  const result = generatedAudioContentSchema.safeParse(json);
  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      details: result.error.issues,
    };
  }

  return {
    success: true,
    content: {
      audio: result.data.audio as GeneratedAudioScript,
    },
  };
}
