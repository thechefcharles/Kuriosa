"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Compass,
  History,
  Search,
  Sparkles,
  Shuffle,
  X,
} from "lucide-react";
import { PageContainer } from "@/components/shared/page-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/queries/useCategories";
import { useFeaturedTopics } from "@/hooks/queries/useFeaturedTopics";
import { useRecentTopics } from "@/hooks/queries/useRecentTopics";
import { useSearchTopics } from "@/hooks/queries/useSearchTopics";
import { useSuggestedTopics } from "@/hooks/queries/useSuggestedTopics";
import { CategoryCard } from "@/components/discovery/category-card";
import { TopicCard } from "@/components/discovery/topic-card";
import { DiscoverySection } from "@/components/discovery/discovery-section";
import { DiscoverySectionHeader } from "@/components/discovery/discovery-section-header";
import {
  DiscoverySectionSkeleton,
  DiscoverySectionEmpty,
  DiscoverySectionError,
  DiscoveryCardGrid,
} from "@/components/discovery/discovery-section-body";
import { ROUTES } from "@/lib/constants/routes";
import { FeedMyCuriosityButton } from "@/components/curiosity/feed-my-curiosity-button";
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

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/85 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="pb-16 pt-6 sm:pt-10">
        <header className="mb-8 text-center sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-kuriosa-electric-cyan/25 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-kuriosa-deep-purple dark:bg-white/5 dark:text-kuriosa-electric-cyan">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Explore
          </div>
          <h1 className="bg-gradient-to-r from-kuriosa-midnight-blue via-kuriosa-deep-purple to-kuriosa-electric-cyan bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            Discover
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            A map of rabbit holes — search, categories, hand-picked curiosities, and where you
            left off.
          </p>
        </header>

        {/* Search */}
        <DiscoverySection className="mb-10">
          <label htmlFor="discover-search" className="sr-only">
            Search topics
          </label>
          <div className="relative mx-auto max-w-xl">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden
            />
            <Input
              id="discover-search"
              type="search"
              placeholder="Search by title, tag, or category…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-11 border-slate-200/90 bg-white/90 pl-10 pr-10 dark:border-white/10 dark:bg-slate-900/60"
              autoComplete="off"
            />
            {searchInput ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0.5 top-1/2 h-9 w-9 -translate-y-1/2 shrink-0 text-muted-foreground"
                onClick={() => setSearchInput("")}
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
          {trimmedSearch.length === 1 ? (
            <p className="mt-2 text-center text-xs text-muted-foreground">
              Type at least two characters to search published topics.
            </p>
          ) : null}

          {searchActive ? (
            <div className="mt-8">
              <DiscoverySectionHeader
                title="Search results"
                description={`Matches for “${trimmedSearch}” in titles, tags, and categories.`}
              />
              {search.isPending ? (
                <DiscoverySectionSkeleton rows={2} />
              ) : search.isError ? (
                <DiscoverySectionError message="Search didn’t load. Try again in a moment." />
              ) : !search.data?.length ? (
                <DiscoverySectionEmpty
                  title="No matches"
                  description="Try another word, browse categories below, or use Jump in / Surprise me."
                />
              ) : (
                <DiscoveryCardGrid>
                  {search.data.map((t) => (
                    <li key={t.id}>
                      <TopicCard topic={t} />
                    </li>
                  ))}
                </DiscoveryCardGrid>
              )}
            </div>
          ) : null}
        </DiscoverySection>

        {/* Categories */}
        <DiscoverySection
          className={cn("mb-14 transition-opacity", searchActive && "opacity-75")}
        >
          <DiscoverySectionHeader
            title="Browse by category"
            description="Each lane leads to a pocket of the universe worth poking at."
          />
          {categories.isPending ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4" aria-busy="true">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-24 animate-pulse rounded-xl bg-muted/80" />
              ))}
            </div>
          ) : categories.isError ? (
            <DiscoverySectionError message="Categories couldn’t load. Pull to refresh or try again in a moment." />
          ) : !categories.data?.length ? (
            <DiscoverySectionEmpty
              title="Categories are on their way"
              description="Once topics are grouped in Supabase, they’ll show up here as doorways to explore."
            />
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.data.map((c) => (
                <li key={c.id}>
                  <CategoryCard
                    category={c}
                    href={ROUTES.discoverCategory(c.slug)}
                    className="h-full min-h-[100px]"
                  />
                </li>
              ))}
            </ul>
          )}
        </DiscoverySection>

        {/* Featured */}
        <DiscoverySection className={cn("mb-14", searchActive && "opacity-90")}>
          <DiscoverySectionHeader
            title="Jump in here"
            description="Short curiosities worth your next coffee break."
          />
          {featured.isPending ? (
            <DiscoverySectionSkeleton rows={2} />
          ) : featured.isError ? (
            <DiscoverySectionError message="We couldn’t load picks right now. Try again soon." />
          ) : !featuredPrimary.length ? (
            <DiscoverySectionEmpty
              title="Nothing featured yet"
              description="Publish a few topics and mark some as random-featured — they’ll land here automatically."
            />
          ) : (
            <DiscoveryCardGrid>
              {featuredPrimary.map((t) => (
                <li key={t.id}>
                  <TopicCard topic={t} />
                </li>
              ))}
            </DiscoveryCardGrid>
          )}
        </DiscoverySection>

        {/* Recent */}
        <DiscoverySection className={cn("mb-14", searchActive && "opacity-90")}>
          <DiscoverySectionHeader
            title="Recently explored"
            description="Curiosities you’ve finished — jump back in anytime."
          />
          {!recent.isAuthenticated ? (
            <div className="rounded-xl border border-dashed border-slate-200/90 bg-white/50 px-4 py-6 text-center dark:border-white/15 dark:bg-slate-900/40">
              <p className="text-sm font-medium text-kuriosa-midnight-blue dark:text-white">
                Sign in to keep a trail
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete a curiosity while signed in and it’ll appear here so you can revisit.
              </p>
              <Link
                href={ROUTES.signIn}
                className="mt-3 inline-block text-sm font-semibold text-kuriosa-electric-cyan hover:underline"
              >
                Sign in
              </Link>
            </div>
          ) : recent.isPending ? (
            <div className="space-y-3" aria-busy="true">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-xl bg-muted/80" />
              ))}
            </div>
          ) : recent.isError ? (
            <DiscoverySectionError message="Recent activity didn’t load. Your history is still safe — try again later." />
          ) : !recent.data.length ? (
            <DiscoverySectionEmpty
              title="No finishes yet"
              description="Finish a curiosity end-to-end and it’ll land here. Try Jump in above or Surprise me below."
            />
          ) : (
            <ul className="space-y-2">
              {recent.data.map((r) => (
                <li key={r.id}>
                  <Link
                    href={ROUTES.curiosity(r.slug)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200/90 bg-white/90 px-4 py-3 shadow-sm transition-all hover:border-kuriosa-electric-cyan/35 hover:shadow-md dark:border-white/10 dark:bg-slate-900/60"
                  >
                    <History className="h-5 w-5 shrink-0 text-kuriosa-electric-cyan" aria-hidden />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-kuriosa-midnight-blue dark:text-white">
                        {r.title}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{r.categoryName}</p>
                    </div>
                    {r.completedAt ? (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(r.completedAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </DiscoverySection>

        {/* Suggested — deterministic, not personalized AI */}
        {suggested.isPending || suggested.isError || suggestedList.length > 0 ? (
          <DiscoverySection className={cn("mb-14", searchActive && "opacity-90")}>
            <DiscoverySectionHeader
              title="More to explore"
              description={
                recent.isAuthenticated && recent.data.length > 0
                  ? "Related lanes and a fresh angle — simple rules, not a recommendation engine."
                  : "A small rotating set from the catalog — dip in anywhere."
              }
            />
            {suggested.isPending ? (
              <DiscoverySectionSkeleton rows={2} />
            ) : suggested.isError ? (
              <DiscoverySectionError message="Couldn’t load suggestions. Everything else on this page still works." />
            ) : (
              <DiscoveryCardGrid>
                {suggestedList.map((t) => (
                  <li key={t.id}>
                    <TopicCard topic={t} />
                  </li>
                ))}
              </DiscoveryCardGrid>
            )}
          </DiscoverySection>
        ) : null}

        {/* Random CTA */}
        <DiscoverySection className="mb-6 rounded-2xl border border-violet-200/50 bg-gradient-to-br from-white to-violet-50/50 p-6 dark:border-white/10 dark:from-slate-900 dark:to-kuriosa-midnight-blue/50">
          <div className="mb-4 flex items-center gap-2 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
            <Shuffle className="h-5 w-5" aria-hidden />
            <h2 className="text-lg font-bold text-kuriosa-midnight-blue dark:text-white">
              Surprise me
            </h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Not sure where to start? Let the app pick a published curiosity.
          </p>
          <FeedMyCuriosityButton />
        </DiscoverySection>

        <p className="text-center text-xs text-muted-foreground">
          <Sparkles className="mr-1 inline h-3 w-3 text-kuriosa-electric-cyan" aria-hidden />
          Trails and follow-ups live inside each curiosity.
        </p>
      </PageContainer>
    </div>
  );
}
