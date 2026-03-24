"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
import { cn } from "@/lib/utils";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";

export type DailyCuriosityCardProps = {
  experience: LoadedCuriosityExperience;
  /** Optional theme from `daily_curiosity.theme` */
  themeLabel?: string | null;
  /** True when user has already completed this topic (no new XP) */
  isCompleted?: boolean;
  className?: string;
};

export function DailyCuriosityCard({
  experience,
  themeLabel,
  isCompleted = false,
  className,
}: DailyCuriosityCardProps) {
  const slug = experience.identity.slug;
  const href = ROUTES.curiosity(slug);
  const minutes = experience.discoveryCard.estimatedMinutes;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-violet-50/80 p-6 shadow-md shadow-violet-950/5 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-kuriosa-deep-purple/20 dark:shadow-violet-950/20 sm:p-8",
        className
      )}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-kuriosa-electric-cyan/15 blur-2xl dark:bg-kuriosa-electric-cyan/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-kuriosa-deep-purple/10 blur-2xl dark:bg-kuriosa-deep-purple/25"
        aria-hidden
      />

      <header className="relative mb-5 flex flex-wrap items-center gap-2">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
            Completed
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-kuriosa-electric-cyan/25 bg-kuriosa-electric-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Today&apos;s curiosity
          </span>
        )}
        {themeLabel?.trim() ? (
          <span className="text-xs text-muted-foreground">{themeLabel.trim()}</span>
        ) : null}
      </header>

      <p className="relative mb-1 text-xs font-medium uppercase tracking-wider text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
        {experience.taxonomy.category}
      </p>
      <h2 className="relative mb-3 text-2xl font-bold leading-tight tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-3xl">
        {experience.identity.title}
      </h2>
      <p className="relative mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
        {experience.discoveryCard.hookQuestion}
      </p>

      <div className="relative mb-8 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 shrink-0 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" aria-hidden />
          <span>
            About {minutes} min{minutes === 1 ? "" : "s"}
          </span>
        </span>
        <DifficultyLabel level={experience.taxonomy.difficultyLevel} />
      </div>

      <div className="relative">
        <Link
          href={href}
          onClick={() =>
            setTopicDiscoveryContext(slug, {
              wasDailyFeature: true,
              wasRandomSpin: false,
            })
          }
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex h-12 min-h-[48px] w-full items-center justify-center text-base font-semibold shadow-lg shadow-kuriosa-deep-purple/15 dark:shadow-kuriosa-electric-cyan/10 sm:h-14 sm:text-lg"
          )}
        >
          {isCompleted ? "Review" : "Start experience"}
        </Link>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          {isCompleted
            ? "No new XP — you've already completed this one."
            : "Lesson, challenge, and more — all in one flow."}
        </p>
      </div>
    </article>
  );
}
