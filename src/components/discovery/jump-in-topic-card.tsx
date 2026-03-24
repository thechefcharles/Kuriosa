"use client";

import Link from "next/link";
import type { TopicCardView } from "@/types/discovery";
import { ROUTES } from "@/lib/constants/routes";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import { getCardXpFromDifficulty } from "@/lib/progress/xp-config";
import { cn } from "@/lib/utils";

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

export function JumpInTopicCard({
  topic,
  className,
}: {
  topic: TopicCardView;
  className?: string;
}) {
  const href = ROUTES.curiosity(topic.slug);
  const diff = (topic.difficulty ?? "").trim().toLowerCase();
  const cardStyle = DIFFICULTY_CARD_STYLES[diff] ?? DEFAULT_CARD;
  const textStyle = DIFFICULTY_TEXT_STYLES[diff] ?? DEFAULT_TEXT;
  const theme = getCategoryTheme(topic.categorySlug);
  const Icon = theme.icon;

  return (
    <Link
      href={href}
      className={cn(
        "block min-h-[200px] overflow-hidden rounded-xl border shadow-sm transition-all",
        "hover:shadow-md active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan",
        cardStyle,
        className
      )}
    >
      {/* Boardwalk-style category banner at top */}
      <div
        className={cn(
          "grid grid-cols-3 items-center gap-2 px-4 py-2",
          theme.bar,
          "text-white"
        )}
      >
        <div />
        <div className="flex items-center justify-center gap-2">
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
          <span className="text-xs font-bold uppercase tracking-wide">
            {topic.categoryName}
          </span>
        </div>
        <div className="flex justify-end">
          <span className="text-xs font-bold tabular-nums">
            +{getCardXpFromDifficulty(topic.difficulty)} XP
          </span>
        </div>
      </div>
      {/* Line underneath the category (Monopoly-style) */}
      <div
        className={cn("h-1 w-full shrink-0", theme.bar)}
        aria-hidden
      />
      {/* Card body - difficulty colored */}
      <div className="flex min-h-[160px] flex-col items-center justify-center p-5 text-center">
        <h3
          className={cn(
            "text-base font-semibold leading-snug",
            textStyle
          )}
        >
          {topic.title}
        </h3>
      </div>
    </Link>
  );
}
