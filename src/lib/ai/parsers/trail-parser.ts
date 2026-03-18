/**
 * Parse and validate trail generation API responses.
 */

import type {
  GeneratedTrailContent,
  GeneratedTrailItem,
} from "@/types/content-generation";
import {
  clampTrailCount,
  trailsResponseSchemaForCount,
} from "@/lib/validations/generated-trails";

export type TrailParseResult =
  | { success: true; content: GeneratedTrailContent }
  | { success: false; error: string; details?: unknown };

export function parseTrailResponse(
  raw: unknown,
  options: { desiredCount?: number }
): TrailParseResult {
  let json: unknown;
  if (typeof raw === "string") {
    try {
      json = JSON.parse(raw) as unknown;
    } catch {
      return { success: false, error: "Invalid JSON in trail response" };
    }
  } else if (raw != null && typeof raw === "object") {
    json = raw;
  } else {
    return { success: false, error: "Invalid response: expected JSON string or object" };
  }

  const count = clampTrailCount(options.desiredCount);
  const schema = trailsResponseSchemaForCount(count);
  const result = schema.safeParse(json);
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
      trails: result.data.trails as GeneratedTrailItem[],
    },
  };
}
