/**
 * Lesson generation: OpenAI → prompts → parse → Zod-validated lesson.
 * Server-side only.
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";
import { buildLessonMessages } from "@/lib/ai/prompts/lesson-prompts";
import { parseLessonResponse } from "@/lib/ai/parsers/lesson-parser";
import type {
  GeneratedLessonContent,
  GeneratedLessonRequestOptions,
} from "@/types/content-generation";

export type GenerateLessonResult =
  | { success: true; lesson: GeneratedLessonContent }
  | { success: false; error: string; details?: unknown };

const DEFAULT_MODEL = "gpt-4o-mini";

/**
 * Generate a single curiosity lesson as structured JSON.
 */
export async function generateLesson(
  options: GeneratedLessonRequestOptions
): Promise<GenerateLessonResult> {
  try {
    const client = getOpenAIClient();
    const messages = buildLessonMessages(options);

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

    const parsed = parseLessonResponse(content);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
        details: parsed.details,
      };
    }

    return { success: true, lesson: parsed.lesson };
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
      error: "Unknown error during lesson generation",
      details: err,
    };
  }
}
