/**
 * Deterministic filters for post-challenge exploration (trails + follow-ups).
 * Keeps broken/self-loop links out of the UI without hiding the section entirely when we can explain.
 */

import type { CuriosityFollowup, CuriosityTrail } from "@/types/curiosity-experience";

export function getDisplayableTrails(
  trails: CuriosityTrail[],
  currentTopicSlug: string
): CuriosityTrail[] {
  const current = currentTopicSlug.trim().toLowerCase();
  return [...trails]
    .filter((t) => {
      const slug = (t.toTopicSlug ?? "").trim();
      if (!slug) return false;
      if (slug.toLowerCase() === current) return false;
      return true;
    })
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getDisplayableFollowups(
  followups: CuriosityFollowup[]
): CuriosityFollowup[] {
  return followups.filter((f) => (f.questionText ?? "").trim().length > 0);
}
