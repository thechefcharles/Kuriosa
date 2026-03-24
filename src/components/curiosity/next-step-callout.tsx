"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";

export function NextStepCallout({
  experience,
  onClick,
}: {
  slug: string;
  experience: LoadedCuriosityExperience;
  /** When provided, used instead of linking to challenge page */
  onClick?: () => void;
}) {
  return (
    <section className="mt-8" aria-label="Take quiz">
      <div className="flex justify-center sm:justify-end">
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
      </div>
    </section>
  );
}

