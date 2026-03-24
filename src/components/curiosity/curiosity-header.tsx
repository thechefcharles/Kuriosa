"use client";

import { Sparkles } from "lucide-react";
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
    </header>
  );
}

