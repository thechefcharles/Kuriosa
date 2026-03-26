/**
 * Central interpretation of badge criteria_type / criteria_value from the DB.
 * Add new criteria here + evaluator aggregates — do not scatter checks across the app.
 */

/** Criteria types stored in badges.criteria_type (extend with migrations + seed). */
export const BADGE_CRITERIA_TYPES = [
  "lessons_completed",
  "streak",
  "categories_explored",
  "quizzes_completed",
  "quiz_perfect_scores",
  "random_completions",
  "category_completions",
  "categories_in_one_day",
  "comeback_gap",
  "advanced_in_row",
  "total_xp",
  "correct_streak",
  "category_xp",
  "daily_multiplier_hit",
] as const;

export type BadgeCriteriaType = (typeof BADGE_CRITERIA_TYPES)[number];

export type BadgeDefinitionRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  criteria_type: string;
  criteria_value: string | null;
};

/** Numeric aggregates after a completion (or any snapshot). */
export type BadgeEvaluationContext = {
  /** Rewarded topic completions (rewards_granted). */
  topicsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  /** Distinct categories among rewarded completions. */
  categoriesExplored: number;
  /** Rewarded rows where challenge was answered (challenge_correct not null). */
  quizzesCompleted: number;
  /** Rewarded rows with challenge_correct === true. */
  perfectChallengeCount: number;
  /** Rewarded rows with was_random_spin. */
  randomCompletionCount: number;
  /** Rewarded completions per category slug, e.g. { science: 3 }. */
  completionsByCategorySlug: Record<string, number>;
  /** Category XP per slug from user_category_xp. */
  categoryXpBySlug: Record<string, number>;
  /** Max distinct categories in any single calendar day. */
  maxCategoriesInOneDay: number;
  /** Days since last activity before this completion (0 = same day or yesterday). */
  comebackGapDays: number;
  /** Longest run of intermediate/advanced/expert topics in a row (by completed_at). */
  advancedInRowMax: number;
  /** Total XP from profiles.total_xp. */
  totalXp: number;
  /** Correct answer streak. */
  correctStreak: number;
  /** Longest correct streak. */
  longestCorrectStreak: number;
  /** True when this completion hit 2.5x daily multiplier. */
  hitLuckyMultiplier?: boolean;
};

function parsePositiveInt(raw: string | null | undefined): number | null {
  if (raw == null || !String(raw).trim()) return null;
  const n = parseInt(String(raw).trim(), 10);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/**
 * category_completions value format: "<category_slug>:<count>" e.g. science:5
 * category_xp value format: "<category_slug>:<xp>" e.g. science:200
 */
export function parseCategoryXpCriteria(
  criteriaValue: string | null | undefined
): { categorySlug: string; required: number } | null {
  if (!criteriaValue?.trim()) return null;
  const parts = criteriaValue.trim().split(":");
  if (parts.length !== 2) return null;
  const [slug, num] = parts;
  const required = parsePositiveInt(num);
  if (required == null || !slug?.trim()) return null;
  return { categorySlug: slug.trim().toLowerCase(), required };
}

/**
 * category_completions value format: "<category_slug>:<count>" e.g. science:5
 */
export function parseCategoryCompletionsCriteria(
  criteriaValue: string | null | undefined
): { categorySlug: string; required: number } | null {
  if (!criteriaValue?.trim()) return null;
  const parts = criteriaValue.trim().split(":");
  if (parts.length !== 2) return null;
  const [slug, num] = parts;
  const required = parsePositiveInt(num);
  if (required == null || !slug?.trim()) return null;
  return { categorySlug: slug.trim().toLowerCase(), required };
}

function streakMeetsThreshold(
  ctx: BadgeEvaluationContext,
  threshold: number
): boolean {
  return (
    ctx.currentStreak >= threshold || ctx.longestStreak >= threshold
  );
}

/**
 * Returns whether the user meets this badge definition given aggregated context.
 */
export function isBadgeEligible(
  def: BadgeDefinitionRow,
  ctx: BadgeEvaluationContext
): boolean {
  const type = def.criteria_type.trim().toLowerCase();
  const threshold = parsePositiveInt(def.criteria_value);

  switch (type) {
    case "lessons_completed":
      return threshold != null && ctx.topicsCompleted >= threshold;

    case "streak":
      return threshold != null && streakMeetsThreshold(ctx, threshold);

    case "categories_explored":
      return threshold != null && ctx.categoriesExplored >= threshold;

    case "quizzes_completed":
      return threshold != null && ctx.quizzesCompleted >= threshold;

    case "quiz_perfect_scores":
      return threshold != null && ctx.perfectChallengeCount >= threshold;

    case "random_completions":
      return threshold != null && ctx.randomCompletionCount >= threshold;

    case "category_completions": {
      const parsed = parseCategoryCompletionsCriteria(def.criteria_value);
      if (!parsed) return false;
      const n = ctx.completionsByCategorySlug[parsed.categorySlug] ?? 0;
      return n >= parsed.required;
    }

    case "categories_in_one_day":
      return threshold != null && ctx.maxCategoriesInOneDay >= threshold;

    case "comeback_gap":
      return threshold != null && ctx.comebackGapDays >= threshold;

    case "advanced_in_row":
      return threshold != null && ctx.advancedInRowMax >= threshold;

    case "total_xp":
      return threshold != null && ctx.totalXp >= threshold;

    case "correct_streak":
      return (
        threshold != null &&
        (ctx.correctStreak >= threshold || ctx.longestCorrectStreak >= threshold)
      );

    case "category_xp": {
      const parsed = parseCategoryXpCriteria(def.criteria_value);
      if (!parsed) return false;
      const xp = ctx.categoryXpBySlug[parsed.categorySlug] ?? 0;
      return xp >= parsed.required;
    }

    case "daily_multiplier_hit":
      return ctx.hitLuckyMultiplier === true;

    default:
      return false;
  }
}

export function isSupportedCriteriaType(criteriaType: string): boolean {
  const t = criteriaType.trim().toLowerCase();
  return (BADGE_CRITERIA_TYPES as readonly string[]).includes(t);
}
