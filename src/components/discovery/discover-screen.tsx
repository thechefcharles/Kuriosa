"use client";

import { useMemo, useState } from "react";
import { useCategories } from "@/hooks/queries/useCategories";
import { useFeaturedTopics } from "@/hooks/queries/useFeaturedTopics";
import { useRecentTopics } from "@/hooks/queries/useRecentTopics";
import { useSearchTopics } from "@/hooks/queries/useSearchTopics";
import { useSuggestedTopics } from "@/hooks/queries/useSuggestedTopics";
import { PageContainer } from "@/components/shared/page-container";
import { DiscoverHeaderCompact } from "@/components/discovery/discover-header-compact";
import { DiscoverHeroZone } from "@/components/discovery/discover-hero-zone";
import { DiscoverCategoryStrip } from "@/components/discovery/discover-category-strip";
import { DiscoverRecentStrip } from "@/components/discovery/discover-recent-strip";
import { DiscoverMoreStrip } from "@/components/discovery/discover-more-strip";
import { DiscoverSurpriseStrip } from "@/components/discovery/discover-surprise-strip";
import { dedupeSuggestedAgainstFeatured } from "@/lib/services/discovery/dedupe-discover-topics";
import { cn } from "@/lib/utils";

const FEATURED_LIMIT = 6;

export function DiscoverScreen() {
  const [searchInput, setSearchInput] = useState("");
  const trimmedSearch = searchInput.trim();
  const searchActive = trimmedSearch.length >= 2;

  const categories = useCategories({ withTopicCounts: true });
  const featured = useFeaturedTopics();
  const recent = useRecentTopics();
  const search = useSearchTopics(searchInput);
  const suggested = useSuggestedTopics();

  const featuredList = featured.data ?? [];
  const featuredPrimary = featuredList.slice(0, FEATURED_LIMIT);
  const suggestedList = suggested.data ?? [];
  const suggestedVisible = useMemo(
    () => dedupeSuggestedAgainstFeatured(suggestedList, featuredPrimary),
    [suggestedList, featuredPrimary]
  );

  const showMoreStrip =
    suggested.isPending ||
    suggested.isError ||
    suggestedVisible.length > 0;

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/85 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="max-w-md pb-16 pt-5 sm:pt-6">
        {/* 1. Compact header */}
        <DiscoverHeaderCompact />

        {/* 2. Hero zone: search + Jump in (or search results) */}
        <DiscoverHeroZone
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          searchActive={searchActive}
          searchQuery={search}
          featured={featured}
        />

        {/* 3. Secondary: category strip */}
        <DiscoverCategoryStrip
          categories={categories.data}
          isLoading={categories.isPending}
          isError={categories.isError}
          errorMessage="Categories couldn't load. Try again."
          searchActive={searchActive}
        />

        {/* 4. Tertiary: Recent */}
        <DiscoverRecentStrip
          isAuthenticated={recent.isAuthenticated}
          recent={recent.data}
          isLoading={recent.isPending}
          isError={recent.isError}
          errorMessage="Recent didn't load. Your history is safe — try again."
          searchActive={searchActive}
        />

        {/* 5. Tertiary: More to explore (conditional) */}
        {showMoreStrip && (
          <DiscoverMoreStrip
            topics={suggestedVisible}
            isLoading={suggested.isPending}
            isError={suggested.isError}
            errorMessage="Couldn't load suggestions. Everything else works."
            searchActive={searchActive}
          />
        )}

        {/* 6. Tertiary: Surprise me */}
        <DiscoverSurpriseStrip searchActive={searchActive} />
      </PageContainer>
    </div>
  );
}
