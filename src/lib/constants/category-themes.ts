import type { LucideIcon } from "lucide-react";
import {
  FlaskConical,
  Landmark,
  TreeDeciduous,
  Cpu,
  Palette,
  Brain,
  Rocket,
  Dna,
  Lightbulb,
  Coins,
  Sparkles,
} from "lucide-react";

export type CategoryTheme = {
  /** Card background and border tint */
  card: string;
  /** Text color for category label */
  label: string;
  /** Title text color */
  title: string;
  /** Monopoly-style bottom bar (solid background) */
  bar: string;
  /** Icon component */
  icon: LucideIcon;
};

/**
 * Gamified category themes for topic cards.
 * Maps category slugs to colors and icons (Monopoly-style).
 */
const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  science: {
    card: "border-sky-300/60 bg-sky-50/95 dark:border-sky-600/40 dark:bg-sky-950/50",
    label: "text-sky-700 dark:text-sky-300",
    title: "text-sky-900 dark:text-sky-50",
    bar: "bg-sky-500",
    icon: FlaskConical,
  },
  history: {
    card: "border-amber-300/60 bg-amber-50/95 dark:border-amber-700/40 dark:bg-amber-950/50",
    label: "text-amber-800 dark:text-amber-200",
    title: "text-amber-950 dark:text-amber-50",
    bar: "bg-amber-600",
    icon: Landmark,
  },
  nature: {
    card: "border-emerald-300/60 bg-emerald-50/95 dark:border-emerald-700/40 dark:bg-emerald-950/50",
    label: "text-emerald-700 dark:text-emerald-300",
    title: "text-emerald-900 dark:text-emerald-50",
    bar: "bg-emerald-500",
    icon: TreeDeciduous,
  },
  technology: {
    card: "border-cyan-300/60 bg-cyan-50/95 dark:border-cyan-700/40 dark:bg-cyan-950/50",
    label: "text-cyan-700 dark:text-cyan-300",
    title: "text-cyan-900 dark:text-cyan-50",
    bar: "bg-cyan-500",
    icon: Cpu,
  },
  culture: {
    card: "border-violet-300/60 bg-violet-50/95 dark:border-violet-700/40 dark:bg-violet-950/50",
    label: "text-violet-700 dark:text-violet-300",
    title: "text-violet-900 dark:text-violet-50",
    bar: "bg-violet-500",
    icon: Palette,
  },
  psychology: {
    card: "border-rose-300/60 bg-rose-50/95 dark:border-rose-700/40 dark:bg-rose-950/50",
    label: "text-rose-700 dark:text-rose-300",
    title: "text-rose-900 dark:text-rose-50",
    bar: "bg-rose-500",
    icon: Brain,
  },
  space: {
    card: "border-indigo-300/60 bg-indigo-50/95 dark:border-indigo-700/40 dark:bg-indigo-950/50",
    label: "text-indigo-700 dark:text-indigo-300",
    title: "text-indigo-900 dark:text-indigo-50",
    bar: "bg-indigo-500",
    icon: Rocket,
  },
  biology: {
    card: "border-lime-300/60 bg-lime-50/95 dark:border-lime-700/40 dark:bg-lime-950/50",
    label: "text-lime-700 dark:text-lime-300",
    title: "text-lime-900 dark:text-lime-50",
    bar: "bg-lime-500",
    icon: Dna,
  },
  philosophy: {
    card: "border-yellow-300/60 bg-yellow-50/95 dark:border-yellow-800/40 dark:bg-yellow-950/50",
    label: "text-yellow-800 dark:text-yellow-200",
    title: "text-yellow-950 dark:text-yellow-50",
    bar: "bg-yellow-500",
    icon: Lightbulb,
  },
  "finance-economics": {
    card: "border-amber-300/60 bg-amber-50/95 dark:border-amber-700/40 dark:bg-amber-950/50",
    label: "text-amber-800 dark:text-amber-200",
    title: "text-amber-950 dark:text-amber-50",
    bar: "bg-amber-600",
    icon: Coins,
  },
  finance: {
    card: "border-amber-300/60 bg-amber-50/95 dark:border-amber-700/40 dark:bg-amber-950/50",
    label: "text-amber-800 dark:text-amber-200",
    title: "text-amber-950 dark:text-amber-50",
    bar: "bg-amber-600",
    icon: Coins,
  },
};

const DEFAULT_THEME: CategoryTheme = {
  card: "border-slate-200/90 bg-white/95 dark:border-white/15 dark:bg-slate-900/60",
  label: "text-muted-foreground",
  title: "text-kuriosa-midnight-blue dark:text-white",
  bar: "bg-slate-600",
  icon: Sparkles,
};

export function getCategoryTheme(categorySlug: string): CategoryTheme {
  const slug = (categorySlug ?? "").trim().toLowerCase();
  return CATEGORY_THEMES[slug] ?? DEFAULT_THEME;
}
