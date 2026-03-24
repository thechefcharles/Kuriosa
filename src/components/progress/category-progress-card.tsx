"use client";

import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import type { CompletedTopicCardView } from "@/lib/services/progress/get-completed-topics-by-category";
import { ROUTES } from "@/lib/constants/routes";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import {
  DIFFICULTY_BANNER,
  DEFAULT_BANNER,
  CARD_BASE,
} from "@/lib/constants/card-styles";
import { cn } from "@/lib/utils";

export function CategoryProgressCard({
  topic,
  className,
}: {
  topic: CompletedTopicCardView;
  className?: string;
}) {
  const diff = (topic.difficulty ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;
  const theme = getCategoryTheme(topic.categorySlug);
  const Icon = theme.icon;
  const isRetry = topic.xpEarned === 5;
  const xpBadgeClass = isRetry ? "xp-badge-wrong" : "xp-badge-correct";

  return (
    <article
      className={cn(
        "flex min-h-[200px] flex-col overflow-hidden rounded-xl border shadow-sm",
        "border-slate-200/90 bg-white dark:border-white/15 dark:bg-slate-900/60",
        CARD_BASE,
        className
      )}
    >
      {/* Difficulty banner with category */}
      <div className={cn("flex min-w-0 items-center justify-center px-3 py-2.5", bannerBg)}>
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
      {/* Card body */}
      <div className="flex min-h-[140px] flex-1 flex-col items-center justify-center p-4 text-center">
        <h3 className="text-base font-semibold leading-snug text-kuriosa-midnight-blue dark:text-slate-50">
          {topic.title}
        </h3>
        <div className="mt-3 flex flex-col items-center gap-2">
          <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Complete
          </span>
          {isRetry ? (
            <XCircle className="h-10 w-10 text-red-500" aria-hidden />
          ) : (
            <CheckCircle2 className="h-10 w-10 text-emerald-500" aria-hidden />
          )}
        </div>
        {/* Footer: Review left, XP right */}
        <div className="mt-4 flex w-full items-center justify-between gap-4 px-2">
          <Link
            href={ROUTES.curiosity(topic.slug)}
            className="inline-flex items-center rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-kuriosa-midnight-blue transition-colors hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Review
          </Link>
          <span
            className={cn(
              "shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white",
              xpBadgeClass
            )}
          >
            +{topic.xpEarned} XP
          </span>
        </div>
      </div>
    </article>
  );
}
