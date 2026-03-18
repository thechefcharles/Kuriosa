/**
 * Lightweight slug/title normalization for trail candidates.
 * No DB lookup or duplicate detection—prepares values for future topic_trails rows.
 */

import type { CuriosityTrail } from "@/types/curiosity-experience";
import type { GeneratedTrailItem } from "@/types/content-generation";

const SLUG_MAX = 72;

/** Derive a URL-safe slug from a display title. */
export function slugifyTrailTitle(title: string): string {
  const s = title
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX);
  return s.length > 0 ? s : "trail-topic";
}

/** True if string looks like a valid kebab slug. */
export function isValidSlugCandidate(s: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s) && s.length <= SLUG_MAX;
}

/**
 * Prefer model slugCandidate when valid; otherwise slugify title.
 */
export function resolveTrailSlugCandidate(item: GeneratedTrailItem): string {
  const c = item.slugCandidate?.trim();
  if (c && isValidSlugCandidate(c)) {
    return c.slice(0, SLUG_MAX);
  }
  return slugifyTrailTitle(item.title);
}

/** Normalize title for display (collapse whitespace). */
export function normalizeTrailTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim();
}

/** Map a generated trail item to CuriosityExperience trail fields. */
export function trailItemToCuriosityTrail(item: GeneratedTrailItem): CuriosityTrail {
  return {
    toTopicSlug: resolveTrailSlugCandidate(item),
    toTopicTitle: normalizeTrailTitle(item.title),
    reasonText: item.reasonText.trim(),
    sortOrder: item.sortOrder,
  };
}
