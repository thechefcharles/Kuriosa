/**
 * Deterministic draft identity for assembled CuriosityExperience (no DB).
 */

import type { CuriosityIdentity } from "@/types/curiosity-experience";
import {
  normalizeCuriosityTitle,
  slugifyCuriositySlug,
} from "@/lib/services/content/slugify-curiosity";

export interface DraftIdentityMeta {
  identity: CuriosityIdentity;
  /** Monotonic draft schema version for persistence migrations */
  draftSchemaVersion: number;
  /** ISO timestamps for audit */
  assembledAtIso: string;
}

const DRAFT_SCHEMA_VERSION = 1;

/**
 * Stable id pattern: draft:{slug} until a real topic UUID exists.
 */
export function createCuriosityDraftIdentity(
  title: string,
  options?: { slugOverride?: string }
): DraftIdentityMeta {
  const normalizedTitle = normalizeCuriosityTitle(title);
  const slug = options?.slugOverride ?? slugifyCuriositySlug(normalizedTitle);
  return {
    identity: {
      id: `draft:${slug}`,
      slug,
      title: normalizedTitle,
    },
    draftSchemaVersion: DRAFT_SCHEMA_VERSION,
    assembledAtIso: new Date().toISOString(),
  };
}
