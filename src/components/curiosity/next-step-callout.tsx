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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-wide text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
            Next
          </div>
          <h2 className="mt-1 text-lg font-bold text-kuriosa-midnight-blue dark:text-slate-50">
            Ready for the challenge?
          </h2>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
            One quick question to lock in what you read.
          </p>
        </div>

        <Link
          href={ROUTES.challenge(slug)}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 whitespace-nowrap sm:w-auto"
          )}
        >
          Take the challenge
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

