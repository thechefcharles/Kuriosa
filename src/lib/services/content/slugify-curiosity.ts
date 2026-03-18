/**
 * Slug and title normalization for CuriosityExperience identity.
 * Aligned with trail slug rules (kebab-case, lowercase).
 */

const SLUG_MAX = 72;

/** URL-safe slug from a topic title. */
export function slugifyCuriositySlug(title: string): string {
  const s = title
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, SLUG_MAX);
  return s.length > 0 ? s : "curiosity-topic";
}

/** Display title: collapse whitespace, trim. */
export function normalizeCuriosityTitle(title: string): string {
  return title.replace(/\s+/g, " ").trim();
}

/** Category label → slug for taxonomy.categorySlug. */
export function slugifyCategorySlug(category: string): string {
  return slugifyCuriositySlug(category);
}
