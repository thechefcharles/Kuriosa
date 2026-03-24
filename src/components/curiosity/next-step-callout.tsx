"use client";

import { Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { getCategoryTheme } from "@/lib/constants/category-themes";

export function NextStepCallout({
  slug,
  experience,
  onClick,
  xpDisplay,
  showBoost,
}: {
  slug: string;
  experience: LoadedCuriosityExperience;
  /** When provided, used instead of linking to challenge page */
  onClick?: () => void;
  /** XP to show in bottom right (optional) */
  xpDisplay?: number;
  /** When true, show lightning bolt before XP to indicate boost applied */
  showBoost?: boolean;
}) {
  const theme = getCategoryTheme(experience.taxonomy.categorySlug);
  return (
    <section className="mt-8" aria-label="Take quiz">
      <div className="flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onClick}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap bg-emerald-500 px-6 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          )}
        >
          Take quiz
        </button>
        {xpDisplay != null && (
          <span
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white",
              showBoost ? "xp-badge-correct" : theme.bar
            )}
          >
            {showBoost && (
              <Zap className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden />
            )}
            +{xpDisplay} XP
          </span>
        )}
      </div>
    </section>
  );
}

