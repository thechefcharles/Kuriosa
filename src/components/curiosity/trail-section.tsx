"use client";

import Link from "next/link";
import { Route } from "lucide-react";
import type { CuriosityTrail } from "@/types/curiosity-experience";
import { TrailCard } from "@/components/curiosity/trail-card";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TrailSectionProps = {
  trails: CuriosityTrail[];
  /** Raw count before filtering invalid/self links — used for a clearer empty state */
  rawTrailCount: number;
};

export function TrailSection({ trails, rawTrailCount }: TrailSectionProps) {
  if (trails.length === 0) {
    const brokenLinks = rawTrailCount > 0;
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/15 px-4 py-7 text-center sm:px-6">
        <Route className="mx-auto mb-3 h-9 w-9 text-muted-foreground/70" aria-hidden />
        <p className="text-sm font-medium text-kuriosa-midnight-blue dark:text-slate-200">
          {brokenLinks
            ? "Next-topic links aren’t available for this lesson yet"
            : "No trail from here — yet"}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {brokenLinks
            ? "Those paths will show up once they’re wired in the catalog. Meantime, keep exploring elsewhere."
            : "This rabbit hole pauses here for now. Discover has plenty more to open."}
        </p>
        <Link
          href={ROUTES.discover}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-5 border-kuriosa-electric-cyan/40"
          )}
        >
          Browse Discover
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-4" role="list">
      {trails.map((t) => (
        <li key={`${t.toTopicSlug}-${t.sortOrder}`}>
          <TrailCard trail={t} />
        </li>
      ))}
    </ul>
  );
}
