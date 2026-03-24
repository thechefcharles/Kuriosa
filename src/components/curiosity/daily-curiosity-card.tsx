"use client";

import Link from "next/link";
import { Check } from "lucide-react";
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
  const category = experience.taxonomy.category;
  const difficulty = formatDifficulty(experience.taxonomy.difficultyLevel);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-3xl border p-6 shadow-lg sm:p-6",
        isCompleted
          ? "border-emerald-400/60 bg-emerald-50/90 dark:border-emerald-600/40 dark:bg-emerald-950/40 dark:shadow-emerald-950/20"
          : "border-slate-200/90 bg-gradient-to-br from-white via-white to-violet-50/80 shadow-violet-950/10 dark:border-white/10 dark:from-slate-900 dark:via-slate-900 dark:to-kuriosa-deep-purple/20 dark:shadow-violet-950/25"
      )}
    >
      {/* Black checkmark in top right when completed */}
      {isCompleted ? (
        <div
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-black"
          aria-hidden
        >
          <Check className="h-6 w-6 text-white" strokeWidth={2.5} />
        </div>
      ) : (
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-kuriosa-electric-cyan/15 blur-3xl dark:bg-kuriosa-electric-cyan/10"
          aria-hidden
        />
      )}

      {/* Category · Difficulty row */}
      <p className="relative mb-2 text-xs font-medium text-muted-foreground">
        {category}
        {difficulty ? ` · ${difficulty}` : ""}
      </p>

      {/* Large title */}
      <h2
        className={cn(
          "relative mb-3 text-2xl font-bold leading-tight tracking-tight sm:text-3xl",
          isCompleted ? "text-emerald-900 dark:text-emerald-100" : "text-kuriosa-midnight-blue dark:text-slate-50"
        )}
      >
        {experience.identity.title}
      </h2>

      {/* Hook question */}
      <p
        className={cn(
          "relative mb-6 text-base leading-relaxed sm:text-lg",
          isCompleted ? "text-emerald-800 dark:text-emerald-200" : "text-slate-600 dark:text-slate-300"
        )}
      >
        {experience.discoveryCard.hookQuestion}
      </p>

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
