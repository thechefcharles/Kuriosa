"use client";

import Link from "next/link";
import { Compass, Sparkles } from "lucide-react";
import { useDailyCuriosity } from "@/hooks/queries/useDailyCuriosity";
import { PageContainer } from "@/components/shared/page-container";
import { DailyCuriosityCard } from "@/components/curiosity/daily-curiosity-card";
import { DailyCuriosityCardSkeleton } from "@/components/curiosity/daily-curiosity-card-skeleton";
import { HomeDailyEmpty, HomeDailyError } from "@/components/home/home-daily-states";
import { Button, buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { APP_NAME, TAGLINE } from "@/lib/constants/brand";
import { cn } from "@/lib/utils";

export function HomeScreen() {
  const daily = useDailyCuriosity();

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/90 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="pb-10 pt-6 sm:pt-10">
        <header className="mb-10 text-center sm:mb-12">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
            {APP_NAME}
          </p>
          <h1 className="bg-gradient-to-r from-kuriosa-midnight-blue via-kuriosa-deep-purple to-kuriosa-electric-cyan bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl">
            {TAGLINE}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
            Open the app and discover something fascinating — starting with today&apos;s pick.
          </p>
        </header>

        <section aria-labelledby="home-daily-heading" className="mb-10">
          <div className="mb-4 flex items-center gap-2 sm:mb-5">
            <Sparkles
              className="h-5 w-5 text-kuriosa-electric-cyan"
              aria-hidden
            />
            <h2
              id="home-daily-heading"
              className="text-lg font-semibold text-kuriosa-midnight-blue dark:text-slate-100"
            >
              Today&apos;s curiosity
            </h2>
          </div>

          {daily.isLoading ? (
            <DailyCuriosityCardSkeleton />
          ) : daily.isError ? (
            <HomeDailyError message={daily.error.message} />
          ) : !daily.data ? (
            <HomeDailyEmpty />
          ) : (
            <DailyCuriosityCard
              experience={daily.data.experience}
              themeLabel={daily.data.theme}
            />
          )}
        </section>

        <section
          aria-label="More ways to explore"
          className="space-y-4 rounded-2xl border border-slate-200/80 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-900/40 sm:p-6"
        >
          <p className="text-center text-sm font-medium text-muted-foreground">
            What&apos;s next?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              type="button"
              variant="outline"
              className="h-12 min-h-[48px] border-kuriosa-deep-purple/25 text-kuriosa-midnight-blue dark:border-kuriosa-electric-cyan/30 dark:text-slate-100"
              disabled
              aria-describedby="feed-curiosity-hint"
            >
              Feed my curiosity
            </Button>
            <Link
              href={ROUTES.discover}
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "inline-flex h-12 min-h-[48px] items-center justify-center gap-2 bg-kuriosa-midnight-blue text-white hover:bg-kuriosa-midnight-blue/90 dark:bg-kuriosa-electric-cyan dark:text-kuriosa-midnight-blue dark:hover:bg-kuriosa-electric-cyan/90"
              )}
            >
              <Compass className="h-4 w-4" aria-hidden />
              Browse Discover
            </Link>
          </div>
          <p
            id="feed-curiosity-hint"
            className="text-center text-xs text-muted-foreground"
          >
            Surprise discoveries are coming soon. For now, explore topics on Discover.
          </p>
        </section>
      </PageContainer>
    </div>
  );
}
