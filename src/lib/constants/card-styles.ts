/**
 * Shared card styling: white body, difficulty-colored banner,
 * category + XP in category-colored boxes.
 */

export const DIFFICULTY_BANNER: Record<string, string> = {
  beginner: "bg-emerald-500 dark:bg-emerald-600",
  easy: "bg-emerald-500 dark:bg-emerald-600",
  intermediate: "bg-amber-500 dark:bg-amber-600",
  advanced: "bg-rose-500 dark:bg-rose-600",
  expert: "bg-rose-500 dark:bg-rose-600",
};

export const DEFAULT_BANNER = "bg-slate-600 dark:bg-slate-500";

export const CARD_BASE =
  "border border-slate-200/90 bg-white dark:border-white/15 dark:bg-slate-900/60";
