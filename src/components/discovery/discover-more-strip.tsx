"use client";

import { TopicCard } from "@/components/discovery/topic-card";
import {
  DiscoverySectionSkeleton,
  DiscoverySectionError,
  DiscoveryCardGrid,
} from "@/components/discovery/discovery-section-body";
import type { TopicCardView } from "@/types/discovery";
import { cn } from "@/lib/utils";

export type DiscoverMoreStripProps = {
  topics: TopicCardView[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  searchActive?: boolean;
};

export function DiscoverMoreStrip({
  topics,
  isLoading,
  isError,
  errorMessage = "Couldn't load suggestions.",
  searchActive = false,
}: DiscoverMoreStripProps) {
  if (topics.length === 0 && !isLoading && !isError) {
    return null;
  }

  return (
    <section
      className={cn(
        "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
        searchActive && "opacity-75"
      )}
      aria-label="More to explore"
    >
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        More picks
      </p>
      {isLoading ? (
        <DiscoverySectionSkeleton rows={1} />
      ) : isError ? (
        <DiscoverySectionError message={errorMessage} />
      ) : (
        <DiscoveryCardGrid className="grid-cols-2 lg:grid-cols-3">
          {topics.map((t) => (
            <li key={t.id}>
              <TopicCard topic={t} />
            </li>
          ))}
        </DiscoveryCardGrid>
      )}
    </section>
  );
}
