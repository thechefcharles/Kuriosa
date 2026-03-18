/**
 * Resolve CuriosityExperience.trails to topic_trails rows (to_topic_id must exist).
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";

export interface TrailRowPayload {
  to_topic_id: string;
  reason_text: string | null;
  sort_order: number;
}

export function partitionTrailsByResolution(
  experience: CuriosityExperience,
  slugToTopicId: Map<string, string>
): {
  resolved: TrailRowPayload[];
  unresolved: Array<{
    toTopicSlug: string;
    toTopicTitle: string;
    reasonText: string;
    sortOrder: number;
  }>;
} {
  const resolved: TrailRowPayload[] = [];
  const unresolved: Array<{
    toTopicSlug: string;
    toTopicTitle: string;
    reasonText: string;
    sortOrder: number;
  }> = [];

  const fromSlug = experience.identity.slug;

  const sorted = [...experience.trails].sort((a, b) => a.sortOrder - b.sortOrder);

  for (const trail of sorted) {
    const toId = slugToTopicId.get(trail.toTopicSlug);
    if (!toId || trail.toTopicSlug === fromSlug) {
      unresolved.push({
        toTopicSlug: trail.toTopicSlug,
        toTopicTitle: trail.toTopicTitle,
        reasonText: trail.reasonText,
        sortOrder: trail.sortOrder,
      });
      continue;
    }
    resolved.push({
      to_topic_id: toId,
      reason_text: trail.reasonText || null,
      sort_order: trail.sortOrder,
    });
  }

  return { resolved, unresolved };
}
