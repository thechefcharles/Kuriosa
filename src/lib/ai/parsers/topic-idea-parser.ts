/**
 * Parse and validate topic idea generation responses.
 */

import type { TopicIdeaCandidate } from "@/types/content-generation";
import { topicIdeasResponseSchema } from "@/lib/validations/topic-idea";

export type TopicIdeaParseResult =
  | { success: true; ideas: TopicIdeaCandidate[] }
  | { success: false; error: string; details?: unknown };

/**
 * Parse raw API response into validated topic ideas.
 */
export function parseTopicIdeasResponse(raw: unknown): TopicIdeaParseResult {
  let json: unknown;
  if (typeof raw === "string") {
    try {
      json = JSON.parse(raw) as unknown;
    } catch {
      return { success: false, error: "Invalid JSON in response" };
    }
  } else if (raw != null && typeof raw === "object") {
    json = raw;
  } else {
    return { success: false, error: "Invalid response: expected JSON string or object" };
  }

  const result = topicIdeasResponseSchema.safeParse(json);
  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      details: result.error.issues,
    };
  }

  return {
    success: true,
    ideas: result.data.ideas as TopicIdeaCandidate[],
  };
}
