"use client";

import { Clock, Sparkles } from "lucide-react";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { DifficultyLabel } from "@/components/curiosity/difficulty-label";
import { cn } from "@/lib/utils";

export function CuriosityHeader({
  experience,
  className,
}: {
  experience: LoadedCuriosityExperience;
  className?: string;
}) {
  const minutes = experience.discoveryCard.estimatedMinutes;

  return (
    <header className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-kuriosa-electric-cyan/25 bg-kuriosa-electric-cyan/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan">
          <Sparkles className="h-3.5 w-3.5" aria-hidden />
          {experience.taxonomy.category}
        </span>
        <DifficultyLabel level={experience.taxonomy.difficultyLevel} />
      </div>

      <h1 className="text-2xl font-bold leading-tight tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-3xl">
        {experience.identity.title}
      </h1>

      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" aria-hidden />
          About {minutes} min{minutes === 1 ? "" : "s"}
        </span>
      </div>

      <p className="rounded-xl border border-slate-200/80 bg-white/60 px-4 py-3 text-sm leading-relaxed text-slate-700 dark:border-white/10 dark:bg-slate-900/40 dark:text-slate-200">
        <span className="font-semibold text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
          Hook:
        </span>{" "}
        {experience.discoveryCard.hookQuestion}
      </p>
    </header>
  );
}

