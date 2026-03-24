"use client";

import { useState } from "react";
import Link from "next/link";
import { useDailyCuriosity } from "@/hooks/queries/useDailyCuriosity";
import { PageContainer } from "@/components/shared/page-container";
import { DailyChallengeCard } from "@/components/home/daily-challenge-card";
import { DailyMultiplierSpinner } from "@/components/home/daily-multiplier-spinner";
import { DailyCuriosityCardSkeleton } from "@/components/curiosity/daily-curiosity-card-skeleton";
import { HomeDailyEmpty, HomeDailyError } from "@/components/home/home-daily-states";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

export function HomeScreen() {
  const daily = useDailyCuriosity();
  const [boostRevealed, setBoostRevealed] = useState(false);

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/90 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="max-w-md pb-10 pt-5 sm:pt-6">
        <header className="mb-4 flex items-start justify-between gap-4" aria-labelledby="home-daily-heading">
          <h1
            id="home-daily-heading"
            className="text-xl font-semibold tracking-tight text-kuriosa-midnight-blue dark:text-slate-100"
          >
            Daily Challenge
          </h1>
          {daily.data && (
            <DailyMultiplierSpinner
              multiplier={daily.data.dailyMultiplier ?? 1.5}
              hasSpun={boostRevealed}
              onSpin={() => setBoostRevealed(true)}
              className="shrink-0"
            />
          )}
        </header>

        <section className="mb-6">
          {daily.isLoading ? (
            <DailyCuriosityCardSkeleton />
          ) : daily.isError ? (
            <HomeDailyError message={daily.error.message} />
          ) : !daily.data ? (
            <HomeDailyEmpty isToday />
          ) : (
            <DailyChallengeCard
              experience={daily.data.experience}
              isCompleted={daily.data.isCompleted}
              challengeCorrect={daily.data.challengeCorrect}
              xpEarned={daily.data.xpEarned}
              dailyMultiplier={daily.data.dailyMultiplier}
              boostRevealed={boostRevealed}
            />
          )}
        </section>

        <section aria-label="Discover more">
          <Link
            href={ROUTES.discover}
            className={cn(
              "block w-full rounded-xl border-2 border-kuriosa-deep-purple bg-kuriosa-deep-purple py-4 text-center text-lg font-semibold text-white shadow-md transition-all",
              "hover:bg-kuriosa-deep-purple/90 hover:shadow-lg active:scale-[0.99]",
              "dark:border-kuriosa-electric-cyan dark:bg-kuriosa-electric-cyan dark:text-kuriosa-midnight-blue dark:hover:bg-kuriosa-electric-cyan/90"
            )}
          >
            Discover
          </Link>
        </section>
      </PageContainer>
    </div>
  );
}
