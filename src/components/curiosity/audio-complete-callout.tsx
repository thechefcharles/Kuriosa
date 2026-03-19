"use client";

import Link from "next/link";
import { ArrowRight, CircleCheck } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Shown after narration ends in Listen Mode. Does not award XP — challenge flow is unchanged.
 */
export function AudioCompleteCallout({
  slug,
  hasChallenge,
  className,
}: {
  slug: string;
  hasChallenge: boolean;
  className?: string;
}) {
  if (!hasChallenge) {
    return (
      <div
        className={cn(
          "mt-6 rounded-2xl border border-kuriosa-electric-cyan/30 bg-kuriosa-electric-cyan/8 p-5 text-center dark:bg-kuriosa-electric-cyan/10 sm:p-6",
          className
        )}
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-kuriosa-midnight-blue dark:text-slate-100">
          That was the full narration — nice work sticking with it.
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Read mode has the same story in text, or keep exploring below.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mt-6 rounded-2xl border-2 border-kuriosa-electric-cyan/35 bg-gradient-to-br from-kuriosa-electric-cyan/12 to-violet-50/50 p-5 shadow-sm dark:border-kuriosa-electric-cyan/25 dark:from-kuriosa-electric-cyan/10 dark:to-slate-900/80 sm:p-6",
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-kuriosa-electric-cyan/25 text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan">
            <CircleCheck className="h-5 w-5" aria-hidden />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-kuriosa-electric-cyan">
              Narration complete
            </p>
            <p className="mt-1 text-base font-semibold text-kuriosa-midnight-blue dark:text-slate-50">
              Ready for a quick check-in?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              One short question — same challenge you&apos;d see after reading. Optional but
              satisfying.
            </p>
          </div>
        </div>
        <Link
          href={ROUTES.challenge(slug)}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 sm:w-auto sm:min-w-[200px]"
          )}
        >
          Continue to challenge
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </div>
  );
}
