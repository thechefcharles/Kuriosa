"use client";

import { FeedMyCuriosityButton } from "@/components/curiosity/feed-my-curiosity-button";
import { cn } from "@/lib/utils";

export type DiscoverSurpriseStripProps = {
  searchActive?: boolean;
};

export function DiscoverSurpriseStrip({
  searchActive = false,
}: DiscoverSurpriseStripProps) {
  return (
    <section
      className={cn(
        "mb-6 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
        searchActive && "opacity-75"
      )}
      aria-label="Random curiosity"
    >
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Prefer a surprise?
      </p>
      <FeedMyCuriosityButton compact />
    </section>
  );
}
