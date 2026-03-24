"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";

const DIFFICULTY_CARD_STYLES: Record<string, string> = {
  beginner:
    "border-emerald-400 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/80",
  easy:
    "border-emerald-400 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/80",
  intermediate:
    "border-amber-400 bg-amber-100 dark:border-amber-600 dark:bg-amber-900/80",
  advanced:
    "border-rose-400 bg-rose-100 dark:border-rose-600 dark:bg-rose-900/80",
  expert:
    "border-rose-400 bg-rose-100 dark:border-rose-600 dark:bg-rose-900/80",
};

const DIFFICULTY_TEXT_STYLES: Record<string, string> = {
  beginner: "text-emerald-900 dark:text-emerald-100",
  easy: "text-emerald-900 dark:text-emerald-100",
  intermediate: "text-amber-900 dark:text-amber-100",
  advanced: "text-rose-900 dark:text-rose-100",
  expert: "text-rose-900 dark:text-rose-100",
};

const DEFAULT_CARD =
  "border-slate-200/90 bg-white/90 dark:border-white/10 dark:bg-slate-900/60";
const DEFAULT_TEXT = "text-kuriosa-midnight-blue dark:text-white";

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
  const href = ROUTES.curiosity(slug);
  const diff = (experience.taxonomy.difficultyLevel ?? "").trim().toLowerCase();
  const cardStyle = DIFFICULTY_CARD_STYLES[diff] ?? DEFAULT_CARD;
  const textStyle = DIFFICULTY_TEXT_STYLES[diff] ?? DEFAULT_TEXT;
  const theme = getCategoryTheme(experience.taxonomy.categorySlug);
  const Icon = theme.icon;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-xl border shadow-lg",
        cardStyle,
        className
      )}
    >
      {/* Boardwalk-style category banner at top */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-4 py-3",
          theme.bar,
          "text-white"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center justify-center gap-2">
          <Icon className="h-5 w-5 shrink-0" strokeWidth={2.5} aria-hidden />
          <span className="text-sm font-bold uppercase tracking-wide truncate">
            {experience.taxonomy.category}
          </span>
        </div>
        {isCompleted ? (
          <span
            className="flex shrink-0 items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold"
            aria-label="Complete"
          >
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
            Complete
            {xpEarned != null && xpEarned > 0 ? (
              <span className="opacity-95">+{xpEarned} XP</span>
            ) : null}
          </span>
        ) : null}
      </div>
      {/* Line underneath the category (Monopoly-style) */}
      <div className={cn("h-1 w-full shrink-0", theme.bar)} aria-hidden />
      {/* Card body - difficulty colored */}
      <div className="relative p-6">
        <div className="flex flex-col items-center text-center">
          <h2
            className={cn(
              "mb-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl",
              textStyle
            )}
          >
            {experience.identity.title}
          </h2>

          <p
            className={cn(
              "mb-6 text-base leading-relaxed sm:text-lg",
              textStyle,
              "opacity-90"
            )}
          >
            {experience.discoveryCard.hookQuestion}
          </p>

          <Link
            href={href}
            onClick={() =>
              setTopicDiscoveryContext(slug, discoverySource)
            }
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full min-h-[48px] items-center justify-center text-base font-semibold shadow-md"
            )}
          >
            {isCompleted ? "Review" : startLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
