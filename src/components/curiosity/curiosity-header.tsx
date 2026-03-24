"use client";

import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import {
  DIFFICULTY_BANNER,
  DEFAULT_BANNER,
} from "@/lib/constants/card-styles";
import { cn } from "@/lib/utils";
export function CuriosityHeader({
  experience,
  className,
  isDailyChallenge,
  dailyMultiplier = 1.5,
  completedState,
  boostRevealed,
  boostMultiplier,
}: {
  experience: LoadedCuriosityExperience;
  className?: string;
  /** When true, show boosted XP (daily challenge multiplier) */
  isDailyChallenge?: boolean;
  /** Daily multiplier when isDailyChallenge (1.2–2.5). Default 1.5. */
  dailyMultiplier?: number;
  /** When set, show completion XP styling (gold shimmer if correct, red if wrong) */
  completedState?: { correct: boolean; xpEarned: number };
  /** When true, show "X× boost applied" badge (daily challenge only) */
  boostRevealed?: boolean;
  /** Multiplier value for boost badge (e.g. 1.5) */
  boostMultiplier?: number;
}) {
  const theme = getCategoryTheme(experience.taxonomy.categorySlug);
  const Icon = theme.icon;
  const diff = (experience.taxonomy.difficultyLevel ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;

  return (
    <header className={cn("space-y-4", className)}>
      {/* Difficulty-colored banner with category */}
      <div className={cn("relative flex flex-col", bannerBg)}>
        <div className="flex min-w-0 items-center justify-center gap-3 px-4 py-4">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1",
              theme.bar,
              "text-sm font-bold uppercase tracking-wide text-white"
            )}
            title={experience.taxonomy.category}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            <span className="truncate max-w-[160px]">{experience.taxonomy.category}</span>
          </span>
          {isDailyChallenge && boostRevealed && boostMultiplier != null && !completedState && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 shrink-0 rounded-md bg-amber-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              {boostMultiplier}× boost applied
            </span>
          )}
        </div>
      </div>
      {/* Title + difficulty */}
      <div className="flex flex-col items-center gap-3 px-5 pb-2 text-center sm:px-6">
        <h1 className="text-2xl font-bold leading-tight tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-3xl">
          {experience.identity.title}
        </h1>
        <DifficultyLabel level={experience.taxonomy.difficultyLevel} />
      </div>
    </header>
  );
}

