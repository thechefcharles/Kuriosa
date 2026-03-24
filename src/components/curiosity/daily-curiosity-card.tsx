"use client";

import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";

function formatDifficulty(raw: string): string {
  const s = raw.trim().toLowerCase().replace(/_/g, " ");
  return s.length ? s.charAt(0).toUpperCase() + s.slice(1) : "";
}

export type DailyCuriosityCardProps = {
  experience: LoadedCuriosityExperience;
  /** True when user has already completed this topic (no new XP) */
  isCompleted?: boolean;
  className?: string;
};

export function DailyCuriosityCard({
  experience,
  isCompleted = false,
  className,
}: DailyCuriosityCardProps) {
  const slug = experience.identity.slug;
  const href = ROUTES.curiosity(slug);
  const minutes = experience.discoveryCard.estimatedMinutes;
  const category = experience.taxonomy.category;
  const difficulty = formatDifficulty(experience.taxonomy.difficultyLevel);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-white to-violet-50/80 p-6 shadow-lg shadow-violet-950/10 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-kuriosa-deep-purple/20 dark:shadow-violet-950/25 sm:p-6",
        className
      )}
    >
      {/* Single accent glow */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-kuriosa-electric-cyan/15 blur-3xl dark:bg-kuriosa-electric-cyan/10"
        aria-hidden
      />

      {/* Category · Difficulty row */}
      <p className="relative mb-2 text-xs font-medium text-muted-foreground">
        {category}
        {difficulty ? ` · ${difficulty}` : ""}
      </p>

      {/* Completed badge when applicable */}
      {isCompleted ? (
        <span className="relative mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <CheckCircle2 className="h-3 w-3" aria-hidden />
          Completed
        </span>
      ) : null}

      {/* Large title */}
      <h2 className="relative mb-3 text-2xl font-bold leading-tight tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-3xl">
        {experience.identity.title}
      </h2>

      {/* Hook question */}
      <p className="relative mb-5 text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
        {experience.discoveryCard.hookQuestion}
      </p>

      {/* Metadata row */}
      <div className="relative mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Clock className="h-4 w-4 shrink-0" aria-hidden />
        <span>
          About {minutes} min{minutes === 1 ? "" : "s"}
        </span>
      </div>

      {/* Primary CTA */}
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
          "relative inline-flex h-12 min-h-[48px] w-full items-center justify-center text-base font-semibold shadow-lg shadow-kuriosa-deep-purple/15 dark:shadow-kuriosa-electric-cyan/10"
        )}
      >
        {isCompleted ? "Review" : "Start today's curiosity"}
      </Link>
    </article>
  );
}
