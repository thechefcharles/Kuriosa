"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { Search, X, ArrowLeftCircle, ArrowRightCircle, Shuffle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TopicCard } from "@/components/discovery/topic-card";
import { JumpInTopicCard } from "@/components/discovery/jump-in-topic-card";
import { DiscoverDifficultyFilter } from "@/components/discovery/discover-difficulty-filter";
import {
  DiscoverySectionSkeleton,
  DiscoverySectionEmpty,
  DiscoverySectionError,
  DiscoveryCardGrid,
} from "@/components/discovery/discovery-section-body";
import type { UseQueryResult } from "@tanstack/react-query";
import type { TopicCardView } from "@/types/discovery";
import { MOBILE_SAFE_ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;

export type DiscoverHeroZoneProps = {
  searchInput: string;
  onSearchChange: (value: string) => void;
  searchActive: boolean;
  searchQuery: UseQueryResult<TopicCardView[], Error>;
  suggestedTopics: UseQueryResult<TopicCardView[], Error>;
  isCategoryFilter?: boolean;
  difficultyFilter?: string;
  onDifficultyChange?: (value: string) => void;
  selectedCategorySlug?: string;
  /** When set, show these 4 cards instead of suggestedTopics (no pagination) */
  randomCards?: TopicCardView[] | null;
  isRandomLoading?: boolean;
  onRandomClick?: () => void;
};

const SWIPE_THRESHOLD = 72;

export function DiscoverHeroZone({
  searchInput,
  onSearchChange,
  searchActive,
  searchQuery,
  suggestedTopics,
  isCategoryFilter = false,
  difficultyFilter = "",
  onDifficultyChange,
  selectedCategorySlug = "",
  randomCards = null,
  isRandomLoading = false,
  onRandomClick,
}: DiscoverHeroZoneProps) {
  const [page, setPage] = useState(0);

  const topicList = useMemo(
    () => suggestedTopics.data ?? [],
    [suggestedTopics.data]
  );
  const useRandomMode = randomCards != null && !searchActive;
  const displayTopics = useMemo(
    () => (useRandomMode ? randomCards ?? [] : topicList),
    [useRandomMode, randomCards, topicList]
  );
  const filteredByDifficulty = useMemo(() => {
    if (useRandomMode) return displayTopics;
    if (!difficultyFilter.trim()) return topicList;
    const diff = difficultyFilter.trim().toLowerCase();
    return topicList.filter((t) => (t.difficulty ?? "").toLowerCase() === diff);
  }, [useRandomMode, displayTopics, topicList, difficultyFilter]);

  const totalPages = useRandomMode
    ? 1
    : Math.max(1, Math.ceil(filteredByDifficulty.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const start = clampedPage * PAGE_SIZE;
  const topicsToShow = useRandomMode
    ? filteredByDifficulty
    : filteredByDifficulty.slice(start, start + PAGE_SIZE);

  const canGoPrev = clampedPage > 0;
  const canGoNext = clampedPage < totalPages - 1;

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const touchStartTarget = useRef<EventTarget | null>(null);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "right" && canGoPrev) {
        setPage((p) => Math.max(0, p - 1));
      } else if (direction === "left" && canGoNext) {
        setPage((p) => Math.min(totalPages - 1, p + 1));
      }
    },
    [canGoPrev, canGoNext, totalPages]
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStartX.current = t?.clientX ?? 0;
    touchStartY.current = t?.clientY ?? 0;
    touchEndX.current = touchStartX.current;
    touchEndY.current = touchStartY.current;
    touchStartTarget.current = e.target;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchEndX.current = t?.clientX ?? 0;
    touchEndY.current = t?.clientY ?? 0;
  }, []);

  const onTouchEnd = useCallback(() => {
    const startEl = touchStartTarget.current;
    if (startEl instanceof Element) {
      if (startEl.closest("a, button, [role='button'], input, textarea, select")) {
        return;
      }
    }
    const dx = touchStartX.current - touchEndX.current;
    const dy = touchStartY.current - touchEndY.current;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    if (Math.abs(dx) < Math.abs(dy) * 1.25) return;
    handleSwipe(dx > 0 ? "left" : "right");
  }, [handleSwipe]);

  useEffect(() => {
    setPage(0);
  }, [difficultyFilter, selectedCategorySlug]);

  return (
    <section className="mb-4" aria-label="Search and featured topics">
      {/* Search bar */}
      <label htmlFor="discover-search" className="sr-only">
        Search topics
      </label>
      <div className="relative mb-3">
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

      {/* Difficulty filter - under search */}
      {!searchActive && onDifficultyChange && (
        <DiscoverDifficultyFilter
          value={difficultyFilter}
          onChange={onDifficultyChange}
          searchActive={searchActive}
          className="mb-4"
        />
      )}

      {/* Shuffle button - above card grid */}
      {!searchActive && onRandomClick && (
        <div className="mb-4 flex justify-center">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={isRandomLoading}
            onClick={onRandomClick}
            aria-label="Shuffle 4 random topics"
            className={cn(
              "h-14 w-14 rounded-full border-2 shadow-md transition-transform hover:scale-110",
              "border-slate-300/80 bg-white/90 text-kuriosa-deep-purple hover:bg-slate-50",
              "dark:border-white/20 dark:bg-slate-900/90 dark:text-kuriosa-electric-cyan dark:hover:bg-slate-800/90"
            )}
          >
            <Shuffle
              className={cn("h-6 w-6", isRandomLoading && "animate-pulse")}
              aria-hidden
            />
          </Button>
        </div>
      )}

      {/* Content: search results or card grid */}
      {searchActive ? (
        <div>
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            Results for &quot;{searchInput.trim()}&quot;
          </p>
          {searchQuery.isPending ? (
            <DiscoverySectionSkeleton count={6} />
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
                  <TopicCard
                  topic={t}
                  href={MOBILE_SAFE_ROUTES.curiosityFromDiscover(t.slug)}
                />
                </li>
              ))}
            </DiscoveryCardGrid>
          )}
        </div>
      ) : (
        <div>
          {isRandomLoading ? (
            <DiscoverySectionSkeleton count={4} />
          ) : suggestedTopics.isPending ? (
            <DiscoverySectionSkeleton count={4} />
          ) : suggestedTopics.isError ? (
            <DiscoverySectionError message="We couldn't load picks right now. Try again soon." />
          ) : !topicsToShow.length ? (
            <DiscoverySectionEmpty
              title={
                difficultyFilter
                  ? "No topics at this difficulty"
                  : isCategoryFilter
                    ? "No topics in this category"
                    : "Nothing featured yet"
              }
              description={
                difficultyFilter
                  ? "Try another difficulty or All."
                  : isCategoryFilter
                    ? "Try another category or search."
                    : "Publish topics and mark some as featured — they'll land here."
              }
            />
          ) : (
            <div
              className="relative"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Prev arrow - top left (only show when more than 1 page) */}
              {totalPages > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!canGoPrev}
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                aria-label="Previous page"
                className="absolute left-0 top-0 z-10 h-11 w-11 rounded-full bg-white/95 shadow-md transition-transform hover:scale-110 dark:bg-slate-900/95"
              >
                <ArrowLeftCircle className="h-7 w-7 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
              </Button>
              )}
              {/* Next arrow - top right */}
              {totalPages > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={!canGoNext}
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                aria-label="Next page"
                className="absolute right-0 top-0 z-10 h-11 w-11 rounded-full bg-white/95 shadow-md transition-transform hover:scale-110 dark:bg-slate-900/95"
              >
                <ArrowRightCircle className="h-7 w-7 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
              </Button>
              )}
              <DiscoveryCardGrid
                className={cn(
                  "grid-cols-2 gap-4 pt-1 sm:gap-5 lg:grid-cols-2",
                  totalPages > 1 && "px-12"
                )}
              >
                {topicsToShow.map((t) => (
                  <li key={t.id}>
                    <JumpInTopicCard
                    topic={t}
                    href={MOBILE_SAFE_ROUTES.curiosityFromDiscover(t.slug)}
                  />
                  </li>
                ))}
              </DiscoveryCardGrid>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
