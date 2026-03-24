"use client";

import { useState, useEffect, useCallback } from "react";
import { useCategories } from "@/hooks/queries/useCategories";
import { useFeaturedTopics } from "@/hooks/queries/useFeaturedTopics";
import { useTopicsByCategory } from "@/hooks/queries/useTopicsByCategory";
import { useSearchTopics } from "@/hooks/queries/useSearchTopics";
import { useFetchRandomTopicCards } from "@/hooks/mutations/useFetchRandomTopicCards";
import type { TopicCardView } from "@/types/discovery";
import { PageContainer } from "@/components/shared/page-container";
import { DiscoverHeaderCompact } from "@/components/discovery/discover-header-compact";
import { DiscoverCategorySelect } from "@/components/discovery/discover-category-select";
import { DiscoverDifficultyFilter } from "@/components/discovery/discover-difficulty-filter";
import { DiscoverHeroZone } from "@/components/discovery/discover-hero-zone";
import { cn } from "@/lib/utils";

export function DiscoverScreen() {
  const [searchInput, setSearchInput] = useState("");
  const [selectedCategorySlug, setSelectedCategorySlug] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const trimmedSearch = searchInput.trim();
  const searchActive = trimmedSearch.length >= 2;

  const categories = useCategories({ withTopicCounts: true });
  const featured = useFeaturedTopics();
  const categoryTopics = useTopicsByCategory(
    selectedCategorySlug || undefined
  );
  const search = useSearchTopics(searchInput);

  const suggestedTopics = selectedCategorySlug ? categoryTopics : featured;

  const [randomCards, setRandomCards] = useState<TopicCardView[] | null>(null);
  const randomMutation = useFetchRandomTopicCards();

  const handleRandomClick = useCallback(() => {
    randomMutation.mutate(
      {
        limit: 4,
        categorySlug: selectedCategorySlug || undefined,
        difficultyLevel: selectedDifficulty || undefined,
      },
      { onSuccess: (data) => setRandomCards(data) }
    );
  }, [selectedCategorySlug, selectedDifficulty]);

  useEffect(() => {
    setRandomCards(null);
  }, [selectedCategorySlug, selectedDifficulty]);

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/85 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="max-w-lg pb-16 pt-5 sm:pt-6">
        {/* 1. Compact header */}
        <DiscoverHeaderCompact />

        {/* 2. Category dropdown */}
        <DiscoverCategorySelect
          categories={categories.data}
          isLoading={categories.isPending}
          isError={categories.isError}
          value={selectedCategorySlug}
          onCategoryChange={setSelectedCategorySlug}
          searchActive={searchActive}
        />

        {/* 3. Hero zone: search, difficulty, cards (or search results) */}
        <DiscoverHeroZone
          searchInput={searchInput}
          onSearchChange={setSearchInput}
          searchActive={searchActive}
          searchQuery={search}
          suggestedTopics={suggestedTopics}
          isCategoryFilter={Boolean(selectedCategorySlug)}
          difficultyFilter={selectedDifficulty}
          onDifficultyChange={setSelectedDifficulty}
          selectedCategorySlug={selectedCategorySlug}
          randomCards={randomCards}
          isRandomLoading={randomMutation.isPending}
          onRandomClick={handleRandomClick}
        />
      </PageContainer>
    </div>
  );
}
