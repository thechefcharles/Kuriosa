"use client";

import Link from "next/link";
import { MOBILE_SAFE_ROUTES, ROUTES } from "@/lib/constants/routes";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import {
  DIFFICULTY_BANNER,
  DEFAULT_BANNER,
  CARD_BASE,
} from "@/lib/constants/card-styles";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { getCardXpFromDifficulty } from "@/lib/progress/xp-config";
import { cn } from "@/lib/utils";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";

export type DailyCuriosityCardProps = {
  experience: LoadedCuriosityExperience;
  /** True when user has already completed this topic (no new XP) */
  isCompleted?: boolean;
  /** XP earned when completed (for display e.g. "+25 XP") */
  xpEarned?: number;
  /** How the user discovered this topic (for completion tracking) */
  discoverySource?: { wasDailyFeature: boolean; wasRandomSpin: boolean };
  /** Button label override when not completed */
  startLabel?: string;
  className?: string;
};

export function DailyCuriosityCard({
  experience,
  isCompleted = false,
  xpEarned,
  discoverySource = { wasDailyFeature: true, wasRandomSpin: false },
  startLabel = "Start today's curiosity",
  className,
}: DailyCuriosityCardProps) {
  const slug = experience.identity.slug;
  const href = MOBILE_SAFE_ROUTES.curiosity(slug);
  const diff = (experience.taxonomy.difficultyLevel ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;
  const theme = getCategoryTheme(experience.taxonomy.categorySlug);
  const Icon = theme.icon;
  const xp = getCardXpFromDifficulty(experience.taxonomy.difficultyLevel);

  return (
    <Link
      href={href}
      onClick={() => setTopicDiscoveryContext(slug, discoverySource)}
      className={cn(
        "block overflow-hidden rounded-xl border shadow-lg transition-all",
        "hover:shadow-xl active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan",
        CARD_BASE,
        className
      )}
    >
      {/* Difficulty-colored banner with category */}
      <div
        className={cn(
          "flex min-w-0 items-center justify-center px-4 py-4",
          bannerBg
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1",
            theme.bar,
            "text-sm font-bold uppercase tracking-wide text-white"
          )}
          title={experience.taxonomy.category}
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
          <span className="truncate max-w-[140px]">{experience.taxonomy.category}</span>
        </span>
      </div>
      {/* Card body - white */}
      <div className="relative p-6">
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-3 text-2xl font-bold leading-tight tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-3xl">
            {experience.identity.title}
          </h2>

          <p className="mb-6 text-base leading-relaxed text-slate-700 dark:text-slate-200 sm:text-lg">
            {experience.discoveryCard.hookQuestion}
          </p>

          {/* CTA area: green when not completed, gray with green text when completed */}
          <div
            className={cn(
              "flex w-full min-h-[48px] items-center justify-center rounded-xl text-base font-semibold",
              isCompleted
                ? "bg-slate-200/80 dark:bg-slate-700/80"
                : "bg-emerald-500 text-white shadow-md dark:bg-emerald-600"
            )}
          >
            {isCompleted ? (
              <span className="text-emerald-700 dark:text-emerald-300">
                Complete
              </span>
            ) : (
              startLabel
            )}
          </div>
        </div>
        {/* Footer: XP bottom right */}
        <div className="flex items-center justify-end border-t border-slate-200/80 px-4 pt-4 dark:border-slate-700/80">
          <span
            className={cn(
              "rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white",
              isCompleted && xpEarned === 5 ? "xp-badge-wrong" : theme.bar
            )}
          >
            +{isCompleted && xpEarned != null ? xpEarned : xp} XP
          </span>
        </div>
      </div>
    </Link>
  );
}
