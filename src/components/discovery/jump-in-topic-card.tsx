"use client";

import Link from "next/link";
import type { TopicCardView } from "@/types/discovery";
import { ROUTES } from "@/lib/constants/routes";
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
  className,
}: {
  topic: TopicCardView;
  className?: string;
}) {
  const href = ROUTES.curiosity(topic.slug);
  const diff = (topic.difficulty ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;
  const theme = getCategoryTheme(topic.categorySlug);
  const Icon = theme.icon;
  const xp = getCardXpFromDifficulty(topic.difficulty);

  return (
    <Link
      href={href}
      className={cn(
        "block min-h-[200px] overflow-hidden rounded-xl border shadow-sm transition-all",
        "hover:shadow-md active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan",
        CARD_BASE,
        className
      )}
    >
      {/* Difficulty-colored banner with category + XP in category-colored boxes */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-4 py-2",
          bannerBg
        )}
      >
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1",
            theme.bar,
            "text-xs font-bold uppercase tracking-wide text-white"
          )}
        >
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
          {topic.categoryName}
        </span>
        <span
          className={cn(
            "rounded-lg px-2.5 py-1 text-xs font-bold tabular-nums text-white",
            theme.bar
          )}
        >
          +{xp} XP
        </span>
      </div>
      {/* Card body - white */}
      <div className="flex min-h-[160px] flex-col items-center justify-center p-5 text-center">
        <h3 className="text-base font-semibold leading-snug text-kuriosa-midnight-blue dark:text-slate-50">
          {topic.title}
        </h3>
      </div>
    </Link>
  );
}
