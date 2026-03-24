/**
 * Shared card styling: white body, difficulty-colored banner (light pastels),
 * category + XP in darker category-colored boxes for contrast.
 */

export const DIFFICULTY_BANNER: Record<string, string> = {
  beginner: "bg-emerald-200 dark:bg-emerald-900/50",
  easy: "bg-emerald-200 dark:bg-emerald-900/50",
  intermediate: "bg-amber-200 dark:bg-amber-900/50",
  advanced: "bg-rose-200 dark:bg-rose-900/50",
  expert: "bg-rose-200 dark:bg-rose-900/50",
};

export const DEFAULT_BANNER = "bg-slate-200 dark:bg-slate-700/50";

export const CARD_BASE =
  "border border-slate-200/90 bg-white dark:border-white/15 dark:bg-slate-900/60";
