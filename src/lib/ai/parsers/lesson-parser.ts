/**
 * Parse and validate lesson generation API responses.
 */

import type { GeneratedLessonContent } from "@/types/content-generation";
import { generatedLessonResponseSchema } from "@/lib/validations/generated-lesson";

export type LessonParseResult =
  | { success: true; lesson: GeneratedLessonContent }
  | { success: false; error: string; details?: unknown };

export function parseLessonResponse(raw: unknown): LessonParseResult {
  let json: unknown;
  if (typeof raw === "string") {
    try {
      json = JSON.parse(raw) as unknown;
    } catch {
      return { success: false, error: "Invalid JSON in lesson response" };
    }
  } else if (raw != null && typeof raw === "object") {
    json = raw;
  } else {
    return { success: false, error: "Invalid response: expected JSON string or object" };
  }

  const result = generatedLessonResponseSchema.safeParse(json);
  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      details: result.error.issues,
    };
  }

  return {
    success: true,
    lesson: result.data.lesson as GeneratedLessonContent,
  };
}
