/**
 * Validation for fully assembled CuriosityExperience drafts (stricter than generic parse).
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";
import { curiosityExperienceSchema } from "@/lib/validations/curiosity-experience";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export type DraftValidationResult =
  | { success: true; data: CuriosityExperience }
  | { success: false; error: string; details?: unknown };

function runDraftIntegrityChecks(
  data: CuriosityExperience
): { ok: true } | { ok: false; error: string; details?: unknown } {
  if (!SLUG_RE.test(data.identity.slug)) {
    return {
      ok: false,
      error: "identity.slug must be lowercase kebab-case",
      details: { slug: data.identity.slug },
    };
  }
  if (data.lesson.lessonText.trim().length < 80) {
    return {
      ok: false,
      error: "lesson.lessonText should be substantial (min ~80 chars)",
    };
  }
  if (data.followups.length < 1 || data.followups.length > 10) {
    return {
      ok: false,
      error: "followups count must be 1–10",
      details: { count: data.followups.length },
    };
  }
  if (data.trails.length > 10) {
    return {
      ok: false,
      error: "trails count must be at most 10",
      details: { count: data.trails.length },
    };
  }
  if (!data.moderation?.reviewStatus) {
    return {
      ok: false,
      error: "moderation.reviewStatus is required on assembled drafts",
    };
  }
  if (!Array.isArray(data.moderation.safetyFlags)) {
    return {
      ok: false,
      error: "moderation.safetyFlags must be an array (may be empty)",
    };
  }
  if (
    !data.analytics?.sourceType ||
    typeof data.analytics.sourceType !== "string"
  ) {
    return {
      ok: false,
      error: "analytics.sourceType is required on assembled drafts",
    };
  }
  if (data.challenge.options.length < 1) {
    return {
      ok: false,
      error: "challenge must have at least one option",
    };
  }
  return { ok: true };
}

/**
 * Parse + assembled-draft integrity checks. Throws ZodError on schema failure.
 */
export function validateCuriosityExperienceDraft(
  input: unknown
): CuriosityExperience {
  const parsed = curiosityExperienceSchema.parse(input);
  const check = runDraftIntegrityChecks(parsed);
  if (!check.ok) {
    throw new Error(check.error);
  }
  return parsed;
}

/**
 * Safe parse + integrity checks for assembled drafts.
 */
export function safeValidateCuriosityExperienceDraft(
  input: unknown
): DraftValidationResult {
  const base = curiosityExperienceSchema.safeParse(input);
  if (!base.success) {
    return {
      success: false,
      error: base.error.message,
      details: base.error.issues,
    };
  }
  const check = runDraftIntegrityChecks(base.data);
  if (!check.ok) {
    return {
      success: false,
      error: check.error,
      details: check.details,
    };
  }
  return { success: true, data: base.data };
}
