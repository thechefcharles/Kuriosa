"use client";

import Link from "next/link";
import { Compass, History, Sparkles, Shuffle } from "lucide-react";
import { PageContainer } from "@/components/shared/page-container";
import { useCategories } from "@/hooks/queries/useCategories";
import { useFeaturedTopics } from "@/hooks/queries/useFeaturedTopics";
import { useRecentTopics } from "@/hooks/queries/useRecentTopics";
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
const EXPLORE_MORE_START = 6;
const EXPLORE_MORE_END = 12;

export function DiscoverScreen() {
  const categories = useCategories({ withTopicCounts: true });
  const featured = useFeaturedTopics();
  const recent = useRecentTopics();

  const featuredList = featured.data ?? [];
  const featuredPrimary = featuredList.slice(0, FEATURED_LIMIT);
  const exploreMore = featuredList.slice(EXPLORE_MORE_START, EXPLORE_MORE_END);

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/85 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="pb-16 pt-6 sm:pt-10">
        <header className="mb-10 text-center sm:mb-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-kuriosa-electric-cyan/25 bg-white/60 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-kuriosa-deep-purple dark:bg-white/5 dark:text-kuriosa-electric-cyan">
            <Compass className="h-3.5 w-3.5" aria-hidden />
            Explore
          </div>
          <h1 className="bg-gradient-to-r from-kuriosa-midnight-blue via-kuriosa-deep-purple to-kuriosa-electric-cyan bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            Discover
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground sm:text-base">
            A map of rabbit holes — categories, hand-picked curiosities, and where you left off.
          </p>
        </header>

        {/* Categories */}
        <DiscoverySection className="mb-14">
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
        <DiscoverySection className="mb-14">
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
        <DiscoverySection className="mb-14">
          <DiscoverySectionHeader
            title="Pick up where you left off"
            description="Recently finished curiosities — tap to revisit the lesson or trails."
          />
          {!recent.isAuthenticated ? (
            <DiscoverySectionEmpty
              title="Sign in to see history"
              description="Your last explorations will appear here after you complete a curiosity while signed in."
            />
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
              description="Complete any curiosity end-to-end and it’ll show up here. Start with Jump in above or spin random below."
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

        {/* Explore more — deterministic second slice of featured; hidden if pool is small */}
        {exploreMore.length > 0 ? (
          <DiscoverySection className="mb-14">
            <DiscoverySectionHeader
              title="Explore more"
              description="Same catalog, different corner — no algorithm, just the next batch of published picks."
            />
            <DiscoveryCardGrid>
              {exploreMore.map((t) => (
                <li key={t.id}>
                  <TopicCard topic={t} />
                </li>
              ))}
            </DiscoveryCardGrid>
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
