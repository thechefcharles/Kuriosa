/**
 * Parse and validate challenge generation API responses.
 */

import type { GeneratedChallengeContent } from "@/types/content-generation";
import { generatedChallengePackSchema } from "@/lib/validations/generated-challenge";

export type ChallengeParseResult =
  | { success: true; challenge: GeneratedChallengeContent }
  | { success: false; error: string; details?: unknown };

export function parseChallengeResponse(raw: unknown): ChallengeParseResult {
  let json: unknown;
  if (typeof raw === "string") {
    try {
      json = JSON.parse(raw) as unknown;
    } catch {
      return { success: false, error: "Invalid JSON in challenge response" };
    }
  } else if (raw != null && typeof raw === "object") {
    json = raw;
  } else {
    return { success: false, error: "Invalid response: expected JSON string or object" };
  }

  const result = generatedChallengePackSchema.safeParse(json);
  if (!result.success) {
    return {
      success: false,
      error: result.error.message,
      details: result.error.issues,
    };
  }

  const d = result.data;
  return {
    success: true,
    challenge: {
      primary: d.primary as GeneratedChallengeContent["primary"],
      bonus: d.bonus as GeneratedChallengeContent["bonus"],
      primaryXpAward: d.primaryXpAward,
      bonusXpAward: d.bonusXpAward,
    },
  };
}
