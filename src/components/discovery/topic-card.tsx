import Link from "next/link";
import { Clock, CheckCircle2 } from "lucide-react";
import type { TopicCardView } from "@/types/discovery";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
import { ROUTES } from "@/lib/constants/routes";
import { getCategoryTheme } from "@/lib/constants/category-themes";
import {
  DIFFICULTY_BANNER,
  DEFAULT_BANNER,
  CARD_BASE,
} from "@/lib/constants/card-styles";
import { getCardXpFromDifficulty } from "@/lib/progress/xp-config";
import { cn } from "@/lib/utils";

export function TopicCard({
  topic,
  href,
  className,
}: {
  topic: TopicCardView;
  href?: string;
  className?: string;
}) {
  const to = href ?? ROUTES.curiosity(topic.slug);
  const minutes = topic.estimatedMinutes;
  const diff = (topic.difficulty ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;
  const theme = getCategoryTheme(topic.categorySlug);
  const Icon = theme.icon;
  const xp = getCardXpFromDifficulty(topic.difficulty);

  return (
    <Link
      href={to}
      className={cn(
        "block min-h-[176px] overflow-hidden rounded-xl border shadow-sm ring-offset-background transition-all",
        "hover:shadow-md hover:ring-1 hover:ring-kuriosa-electric-cyan/25 active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan",
        "hover:border-kuriosa-electric-cyan/45 dark:hover:border-kuriosa-electric-cyan/30",
        CARD_BASE,
        className
      )}
    >
      {/* Difficulty-colored banner with category + XP in category-colored boxes */}
      <div
        className={cn(
          "flex items-center justify-between gap-2 px-3 py-2",
          bannerBg
        )}
      >
        <span
          className={cn(
            "inline-flex min-w-0 items-center gap-1.5 truncate rounded-lg px-2 py-0.5",
            theme.bar,
            "text-xs font-bold uppercase tracking-wide text-white"
          )}
        >
          <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
          {topic.categoryName}
        </span>
        <span
          className={cn(
            "shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold tabular-nums text-white",
            theme.bar
          )}
        >
          +{xp} XP
        </span>
      </div>
      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 min-h-[2.5rem] flex-1 text-base font-semibold leading-snug text-kuriosa-midnight-blue dark:text-white">
            {topic.title}
          </h3>
          {topic.isCompleted ? (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
              Done
            </span>
          ) : null}
        </div>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
          {topic.hook}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {topic.difficulty ? (
            <DifficultyLabel level={topic.difficulty} />
          ) : null}
          {minutes != null ? (
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {minutes} min
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
