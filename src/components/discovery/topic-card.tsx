import Link from "next/link";
import { Clock, CheckCircle2 } from "lucide-react";
import type { TopicCardView } from "@/types/discovery";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
import { ROUTES } from "@/lib/constants/routes";
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

  const inner = (
    <>
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 min-h-[2.5rem] text-base font-semibold leading-snug text-kuriosa-midnight-blue dark:text-white">
          {topic.title}
        </h3>
        {topic.isCompleted ? (
          <CheckCircle2
            className="h-5 w-5 shrink-0 text-emerald-500"
            aria-label="Completed"
          />
        ) : null}
      </div>
      <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm text-muted-foreground">
        {topic.hook}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex max-w-full truncate rounded-full border border-violet-200/70 bg-violet-50/80 px-2.5 py-0.5 text-xs font-medium text-kuriosa-deep-purple dark:border-white/15 dark:bg-white/10 dark:text-kuriosa-electric-cyan">
          {topic.categoryName}
        </span>
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
    </>
  );

  return (
    <Link
      href={to}
      className={cn(
        "block min-h-[180px] rounded-xl border border-slate-200/90 bg-white/90 p-4 shadow-sm transition-all",
        "hover:border-kuriosa-electric-cyan/40 hover:shadow-md active:scale-[0.99]",
        "dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-kuriosa-electric-cyan/30",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-electric-cyan",
        className
      )}
    >
      {inner}
    </Link>
  );
}
