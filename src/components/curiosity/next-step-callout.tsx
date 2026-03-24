"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { getCategoryTheme } from "@/lib/constants/category-themes";

export function NextStepCallout({
  slug,
  experience,
  onClick,
  xpDisplay,
}: {
  slug: string;
  experience: LoadedCuriosityExperience;
  /** When provided, used instead of linking to challenge page */
  onClick?: () => void;
  /** XP to show in bottom right (optional) */
  xpDisplay?: number;
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
              "shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white",
              theme.bar
            )}
          >
            +{xpDisplay} XP
          </span>
        )}
      </div>
    </section>
  );
}

