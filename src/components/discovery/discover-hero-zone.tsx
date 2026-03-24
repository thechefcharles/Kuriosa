"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/discovery/topic-card";
import {
  DiscoverySectionSkeleton,
  DiscoverySectionEmpty,
  DiscoverySectionError,
  DiscoveryCardGrid,
} from "@/components/discovery/discovery-section-body";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TopicCardView } from "@/types/discovery";

const FEATURED_LIMIT = 6;

export type DiscoverHeroZoneProps = {
  searchInput: string;
  onSearchChange: (value: string) => void;
  searchActive: boolean;
  searchQuery: UseQueryResult<TopicCardView[], Error>;
  featured: UseQueryResult<TopicCardView[], Error>;
};

export function DiscoverHeroZone({
  searchInput,
  onSearchChange,
  searchActive,
  searchQuery,
  featured,
}: DiscoverHeroZoneProps) {
  const featuredList = featured.data ?? [];
  const featuredPrimary = featuredList.slice(0, FEATURED_LIMIT);

  return (
    <section className="mb-4" aria-label="Search and featured topics">
      {/* Search bar */}
      <label htmlFor="discover-search" className="sr-only">
        Search topics
      </label>
      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id="discover-search"
          type="search"
          placeholder="Search topics…"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-11 w-full border-slate-200/90 bg-white/90 pl-10 pr-10 dark:border-white/10 dark:bg-slate-900/60"
          autoComplete="off"
        />
        {searchInput ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0.5 top-1/2 h-9 w-9 -translate-y-1/2 shrink-0 text-muted-foreground"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        ) : null}
      </div>

      {/* Content: search results or Jump in grid */}
      {searchActive ? (
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Results for &quot;{searchInput.trim()}&quot;
          </p>
          {searchQuery.isPending ? (
            <DiscoverySectionSkeleton rows={2} />
          ) : searchQuery.isError ? (
            <DiscoverySectionError message="Search didn't load. Try again in a moment." />
          ) : !searchQuery.data?.length ? (
            <DiscoverySectionEmpty
              title="No matches"
              description="Try another word or browse categories below."
            />
          ) : (
            <DiscoveryCardGrid>
              {searchQuery.data.map((t) => (
                <li key={t.id}>
                  <TopicCard topic={t} />
                </li>
              ))}
            </DiscoveryCardGrid>
          )}
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">Jump in</p>
          {featured.isPending ? (
            <DiscoverySectionSkeleton rows={2} />
          ) : featured.isError ? (
            <DiscoverySectionError message="We couldn't load picks right now. Try again soon." />
          ) : !featuredPrimary.length ? (
            <DiscoverySectionEmpty
              title="Nothing featured yet"
              description="Publish topics and mark some as featured — they'll land here."
            />
          ) : (
            <DiscoveryCardGrid className="grid-cols-2 lg:grid-cols-3">
              {featuredPrimary.map((t) => (
                <li key={t.id}>
                  <TopicCard topic={t} />
                </li>
              ))}
            </DiscoveryCardGrid>
          )}
        </div>
      )}
    </section>
  );
}
