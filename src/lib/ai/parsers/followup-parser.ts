/**
 * Parse and validate follow-up generation API responses.
 */

import type {
  GeneratedFollowupContent,
  GeneratedFollowupItem,
} from "@/types/content-generation";
import {
  clampFollowupCount,
  followupsResponseSchemaForCount,
} from "@/lib/validations/generated-followups";

export type FollowupParseResult =
  | { success: true; content: GeneratedFollowupContent }
  | { success: false; error: string; details?: unknown };

export function parseFollowupResponse(
  raw: unknown,
  options: { desiredCount?: number }
): FollowupParseResult {
  let json: unknown;
  if (typeof raw === "string") {
    try {
      json = JSON.parse(raw) as unknown;
    } catch {
      return { success: false, error: "Invalid JSON in follow-up response" };
    }
  } else if (raw != null && typeof raw === "object") {
    json = raw;
  } else {
    return { success: false, error: "Invalid response: expected JSON string or object" };
  }

  const count = clampFollowupCount(options.desiredCount);
  const schema = followupsResponseSchemaForCount(count);
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
      followups: result.data.followups as GeneratedFollowupItem[],
    },
  };
}
