"use client";

import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import {
  DIFFICULTY_BANNER,
  DEFAULT_BANNER,
} from "@/lib/constants/card-styles";
import { cn } from "@/lib/utils";
import { getCardXpFromDifficulty } from "@/lib/progress/xp-config";

export function CuriosityHeader({
  experience,
  className,
  isDailyChallenge,
  dailyMultiplier = 1.5,
  completedState,
}: {
  experience: LoadedCuriosityExperience;
  className?: string;
  /** When true, show boosted XP (daily challenge multiplier) */
  isDailyChallenge?: boolean;
  /** Daily multiplier when isDailyChallenge (1.2–2.5). Default 1.5. */
  dailyMultiplier?: number;
  /** When set, show completion XP styling (gold shimmer if correct, red if wrong) */
  completedState?: { correct: boolean; xpEarned: number };
}) {
  const theme = getCategoryTheme(experience.taxonomy.categorySlug);
  const Icon = theme.icon;
  const diff = (experience.taxonomy.difficultyLevel ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;
  const baseXp = getCardXpFromDifficulty(experience.taxonomy.difficultyLevel);
  const xp =
    isDailyChallenge ? Math.round(baseXp * dailyMultiplier) : baseXp;
  const displayXp = completedState ? completedState.xpEarned : xp;
  const xpBadgeClass = completedState
    ? completedState.correct
      ? "xp-badge-correct"
      : "xp-badge-wrong"
    : theme.bar;

  return (
    <header className={cn("space-y-4", className)}>
      {/* Difficulty-colored banner with category + XP in category-colored boxes */}
      <div className={cn("flex flex-col", bannerBg)}>
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1",
              theme.bar,
              "text-sm font-bold uppercase tracking-wide text-white"
            )}
          >
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            {experience.taxonomy.category}
          </span>
          <span
            className={cn(
              "rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white",
              xpBadgeClass
            )}
          >
            +{displayXp} XP
          </span>
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

