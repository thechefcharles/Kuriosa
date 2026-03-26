"use client";

import Link from "next/link";
import type { TopicCardView } from "@/types/discovery";
import { MOBILE_SAFE_ROUTES } from "@/lib/constants/routes";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import {
  DIFFICULTY_BANNER,
  DEFAULT_BANNER,
  CARD_BASE,
} from "@/lib/constants/card-styles";
import { getCardXpFromDifficulty } from "@/lib/progress/xp-config";
import { cn } from "@/lib/utils";

export function JumpInTopicCard({
  topic,
  href,
  className,
}: {
  topic: TopicCardView;
  href?: string;
  className?: string;
}) {
  const to = href ?? MOBILE_SAFE_ROUTES.curiosity(topic.slug);
  const diff = (topic.difficulty ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;
  const theme = getCategoryTheme(topic.categorySlug);
  const Icon = theme.icon;
  const xp = getCardXpFromDifficulty(topic.difficulty);

  return (
    <Link
      href={to}
      className={cn(
        "block min-h-[200px] overflow-hidden rounded-xl border shadow-sm transition-all",
        "hover:shadow-md active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan",
        CARD_BASE,
        className
      )}
    >
      {/* Difficulty-colored banner with category */}
      <div
        className={cn(
          "flex min-w-0 items-center justify-center px-3 py-2.5",
          bannerBg
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-2 py-0.5",
            theme.bar,
            "text-[10px] font-bold uppercase leading-tight tracking-wide text-white"
          )}
          title={topic.categoryName}
        >
          <Icon className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
          <span className="truncate max-w-[120px]">{topic.categoryName}</span>
        </span>
      </div>
      {/* Card body - white */}
      <div className="flex min-h-[160px] flex-col items-center justify-center p-5 text-center">
        <h3 className="text-base font-semibold leading-snug text-kuriosa-midnight-blue dark:text-slate-50">
          {topic.title}
        </h3>
      </div>
      {/* Footer: XP bottom right */}
      <div className="flex items-center justify-end border-t border-slate-200/80 px-4 py-2 dark:border-slate-700/80">
        <span
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-bold tabular-nums text-white",
            theme.bar
          )}
        >
          +{xp} XP
        </span>
      </div>
    </Link>
  );
}
