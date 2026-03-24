import Link from "next/link";
import { Clock, CheckCircle2 } from "lucide-react";
import type { TopicCardView } from "@/types/discovery";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
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

const DEFAULT_CARD =
  "border-slate-200/90 bg-white/90 dark:border-white/10 dark:bg-slate-900/60";

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
  const cardStyle = DIFFICULTY_CARD_STYLES[diff] ?? DEFAULT_CARD;
  const theme = getCategoryTheme(topic.categorySlug);
  const Icon = theme.icon;

  return (
    <Link
      href={to}
      className={cn(
        "block min-h-[176px] overflow-hidden rounded-xl border shadow-sm ring-offset-background transition-all",
        "hover:shadow-md hover:ring-1 hover:ring-kuriosa-electric-cyan/25 active:scale-[0.99]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan",
        cardStyle,
        "hover:border-kuriosa-electric-cyan/45 dark:hover:border-kuriosa-electric-cyan/30",
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
        <div className="flex min-w-0 items-center justify-center gap-2">
          <Icon className="h-4 w-4 shrink-0" strokeWidth={2.5} aria-hidden />
          <span className="truncate text-xs font-bold uppercase tracking-wide">
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
      <div className={cn("h-1 w-full shrink-0", theme.bar)} aria-hidden />
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
