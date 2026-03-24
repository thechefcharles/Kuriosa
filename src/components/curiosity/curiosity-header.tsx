"use client";

import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import { cn } from "@/lib/utils";
import {
  XP_CONFIG,
  DIFFICULTY_MULTIPLIERS,
} from "@/lib/progress/xp-config";

function getCardXp(experience: LoadedCuriosityExperience): number {
  const base =
    XP_CONFIG.LESSON_COMPLETION_XP + XP_CONFIG.CHALLENGE_COMPLETION_XP;
  const mult =
    DIFFICULTY_MULTIPLIERS[
      experience.taxonomy.difficultyLevel as keyof typeof DIFFICULTY_MULTIPLIERS
    ] ?? 1;
  return Math.round(base * mult);
}

const DIFFICULTY_TEXT_STYLES: Record<string, string> = {
  beginner: "text-emerald-900 dark:text-emerald-100",
  easy: "text-emerald-900 dark:text-emerald-100",
  intermediate: "text-amber-900 dark:text-amber-100",
  advanced: "text-rose-900 dark:text-rose-100",
  expert: "text-rose-900 dark:text-rose-100",
};

const DEFAULT_TEXT = "text-kuriosa-midnight-blue dark:text-white";

export function CuriosityHeader({
  experience,
  className,
}: {
  experience: LoadedCuriosityExperience;
  className?: string;
}) {
  const theme = getCategoryTheme(experience.taxonomy.categorySlug);
  const Icon = theme.icon;
  const diff = (experience.taxonomy.difficultyLevel ?? "").trim().toLowerCase();
  const textStyle = DIFFICULTY_TEXT_STYLES[diff] ?? DEFAULT_TEXT;

  return (
    <header className={cn("space-y-4", className)}>
      {/* Boardwalk-style category banner + line (flush, no gap) */}
      <div className="flex flex-col">
        <div
          className={cn(
            "grid grid-cols-3 items-center gap-3 px-4 py-3",
            theme.bar,
            "text-white"
          )}
        >
          <div />
          <div className="flex items-center justify-center gap-2">
            <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
            <span className="text-sm font-bold uppercase tracking-wide truncate">
              {experience.taxonomy.category}
            </span>
          </div>
          <div className="flex justify-end">
            <span className="text-sm font-bold tabular-nums">
              +{getCardXp(experience)} XP
            </span>
          </div>
        </div>
        {/* Line underneath (Monopoly-style) - flush with banner */}
        <div className={cn("h-1 w-full shrink-0", theme.bar)} aria-hidden />
      </div>
      {/* Title + difficulty */}
      <div className="flex flex-col items-center gap-3 px-5 pb-2 text-center sm:px-6">
        <h1
          className={cn(
            "text-2xl font-bold leading-tight tracking-tight sm:text-3xl",
            textStyle
          )}
        >
          {experience.identity.title}
        </h1>
        <DifficultyLabel level={experience.taxonomy.difficultyLevel} />
      </div>
    </header>
  );
}

