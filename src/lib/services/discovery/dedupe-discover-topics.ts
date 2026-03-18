import type { TopicCardView } from "@/types/discovery";

/**
 * Remove suggested cards that already appear in “Jump in here” so Discover feels less repetitive.
 */
export function dedupeSuggestedAgainstFeatured(
  suggested: TopicCardView[],
  featured: TopicCardView[]
): TopicCardView[] {
  if (!suggested.length || !featured.length) return suggested;
  const featuredSlugs = new Set(featured.map((t) => t.slug));
  return suggested.filter((t) => !featuredSlugs.has(t.slug));
}
