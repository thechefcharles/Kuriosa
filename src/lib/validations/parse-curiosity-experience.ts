/**
 * Parsing and validation helpers for CuriosityExperience.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";
import { curiosityExperienceSchema } from "./curiosity-experience";

export type ParseResult =
  | { success: true; data: CuriosityExperience }
  | { success: false; error: { message: string; issues?: unknown } };

/**
 * Parse and validate a CuriosityExperience.
 * Throws on validation failure.
 */
export function parseCuriosityExperience(input: unknown): CuriosityExperience {
  return curiosityExperienceSchema.parse(input) as CuriosityExperience;
}

/**
 * Safe parse: returns a result object instead of throwing.
 */
export function safeParseCuriosityExperience(input: unknown): ParseResult {
  const result = curiosityExperienceSchema.safeParse(input);
  if (result.success) {
    return { success: true, data: result.data as CuriosityExperience };
  }
  return {
    success: false,
    error: {
      message: result.error.message,
      issues: result.error.issues,
    },
  };
}
