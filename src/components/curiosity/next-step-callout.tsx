"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function NextStepCallout({ slug }: { slug: string }) {
  return (
    <section
      className="mt-8 rounded-2xl border border-kuriosa-electric-cyan/25 bg-kuriosa-electric-cyan/10 p-5 dark:border-kuriosa-electric-cyan/15"
      aria-label="Next step"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
            Next
          </div>
          <h2 className="mt-1 text-lg font-bold text-kuriosa-midnight-blue dark:text-slate-50">
            Ready for the challenge?
          </h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            Test what you just learned — a quick quiz is coming next.
          </p>
        </div>

        <Link
          href={ROUTES.challenge(slug)}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex items-center justify-center gap-2 whitespace-nowrap"
          )}
        >
          Go to challenge
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

