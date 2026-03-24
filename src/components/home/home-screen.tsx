"use client";

import Link from "next/link";
import { useDailyCuriosity } from "@/hooks/queries/useDailyCuriosity";
import { PageContainer } from "@/components/shared/page-container";
import { DailyCuriosityCard } from "@/components/curiosity/daily-curiosity-card";
import { DailyCuriosityCardSkeleton } from "@/components/curiosity/daily-curiosity-card-skeleton";
import { HomeDailyEmpty, HomeDailyError } from "@/components/home/home-daily-states";
import { FeedMyCuriosityButton } from "@/components/curiosity/feed-my-curiosity-button";
import { ROUTES } from "@/lib/constants/routes";
import { getSessionCompletionCount } from "@/lib/progress/session-completion-tracker";
import { cn } from "@/lib/utils";

function getHomeHeaderCopy(
  sessionCount: number,
  isDailyCompleted: boolean
): { eyebrow: string; title: string } {
  if (sessionCount >= 2) {
    return {
      eyebrow: "Today's curiosity",
      title: "You're on a roll",
    };
  }
  if (sessionCount === 1) {
    return {
      eyebrow: "Today's curiosity",
      title: isDailyCompleted ? "Ready for another?" : "1 curiosity explored today",
    };
  }
  return {
    eyebrow: "Today's curiosity",
    title: "Start with today's pick.",
  };
}

export function HomeScreen() {
  const daily = useDailyCuriosity();
  const sessionCount = getSessionCompletionCount();
  const isDailyCompleted = daily.data?.isCompleted ?? false;
  const { eyebrow, title } = getHomeHeaderCopy(sessionCount, isDailyCompleted);

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/90 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="max-w-md pb-10 pt-5 sm:pt-6">
        {/* 1. Compact header */}
        <header className="mb-4" aria-labelledby="home-daily-heading">
          <p
            id="home-daily-heading"
            className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
          >
            {eyebrow}
          </p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-kuriosa-midnight-blue dark:text-slate-100">
            {title}
          </h1>
        </header>

        {/* 2. Hero curiosity card */}
        <section className="mb-4">
          {daily.isLoading ? (
            <DailyCuriosityCardSkeleton />
          ) : daily.isError ? (
            <HomeDailyError message={daily.error.message} />
          ) : !daily.data ? (
            <HomeDailyEmpty />
          ) : (
            <DailyCuriosityCard
              experience={daily.data.experience}
              isCompleted={daily.data.isCompleted}
            />
          )}
        </section>

        {/* 3. Secondary: random strip */}
        <section
          className="rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40"
          aria-label="Random curiosity"
        >
          <p className="mb-3 text-sm font-medium text-muted-foreground">
            {sessionCount >= 1 ? "Try a surprise" : "Prefer a surprise?"}
          </p>
          <FeedMyCuriosityButton
            dailyTopicSlug={daily.data?.experience.identity.slug ?? null}
            compact
          />
        </section>

        {/* 4. Tertiary: Browse link */}
        <div className="mt-3 text-center">
          <Link
            href={ROUTES.discover}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Browse all topics
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
