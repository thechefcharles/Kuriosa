"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import Link from "next/link";
import { ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDailyCuriosity } from "@/hooks/queries/useDailyCuriosity";
import { useFetchRandomCuriosityForHome } from "@/hooks/mutations/useFetchRandomCuriosityForHome";
import { PageContainer } from "@/components/shared/page-container";
import { DailyCuriosityCard } from "@/components/curiosity/daily-curiosity-card";
import { DailyCuriosityCardSkeleton } from "@/components/curiosity/daily-curiosity-card-skeleton";
import { HomeDailyEmpty, HomeDailyError } from "@/components/home/home-daily-states";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";

type ViewItem =
  | {
      type: "daily";
      experience: import("@/types/curiosity-experience").LoadedCuriosityExperience;
      isCompleted: boolean;
      xpEarned?: number;
    }
  | {
      type: "random";
      experience: import("@/types/curiosity-experience").LoadedCuriosityExperience;
      isCompleted: boolean;
      xpEarned?: number;
    };

export function HomeScreen() {
  const [viewStack, setViewStack] = useState<ViewItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<"next" | "prev">("next");
  const hasNavigated = useRef(false);

  const daily = useDailyCuriosity();
  const randomMutation = useFetchRandomCuriosityForHome();

  const stackWithDaily = useMemo(() => {
    if (!daily.data) return viewStack;
    const dailyItem: ViewItem = {
      type: "daily",
      experience: daily.data.experience,
      isCompleted: daily.data.isCompleted,
      xpEarned: daily.data.xpEarned,
    };
    if (viewStack.length === 0) return [dailyItem];
    if (viewStack[0]?.type === "daily") return viewStack;
    return [dailyItem, ...viewStack];
  }, [daily.data, viewStack]);

  const currentItem = stackWithDaily[currentIndex] ?? null;
  const canGoPrev = currentIndex > 0;
  const canGoNext = true;

  const goToPrev = useCallback(() => {
    if (!canGoPrev) return;
    hasNavigated.current = true;
    setSlideDirection("prev");
    setCurrentIndex((i) => i - 1);
  }, [canGoPrev]);

  const goToNext = useCallback(() => {
    hasNavigated.current = true;
    setSlideDirection("next");
    const excludeSlug = currentItem?.experience.identity.slug ?? daily.data?.experience.identity.slug ?? null;
    randomMutation.mutate(
      { excludeSlug },
      {
        onSuccess: (data) => {
          if (data) {
            setViewStack((prev) => {
              const next = prev.slice(0, currentIndex + 1);
              next.push({
                type: "random",
                experience: data.experience,
                isCompleted: data.isCompleted,
                xpEarned: data.xpEarned,
              });
              return next;
            });
            setCurrentIndex((i) => (daily.data ? i + 1 : 0));
          }
        },
      }
    );
  }, [currentItem, daily.data, currentIndex, viewStack.length, randomMutation]);

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
          <h1
            id="home-daily-heading"
            className="text-xl font-semibold tracking-tight text-kuriosa-midnight-blue dark:text-slate-100"
          >
            {currentItem?.type === "daily" ? "Today's curiosity" : "Curiosity"}
          </h1>
        </header>

        {/* 2. Hero curiosity card with arrows */}
        <section className="relative mb-4">
          <div className="flex items-stretch gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              disabled={!canGoPrev}
              aria-label="Previous curiosity"
              className="h-auto shrink-0 self-center rounded-full bg-white/95 p-2 shadow-md transition-transform hover:scale-110 disabled:opacity-50 dark:bg-slate-900/95"
            >
              <ArrowLeftCircle className="h-8 w-8 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
            </Button>

            <div className="min-w-0 flex-1 overflow-hidden">
              {daily.isLoading && stackWithDaily.length === 0 ? (
                <DailyCuriosityCardSkeleton />
              ) : daily.isError ? (
                <HomeDailyError message={daily.error.message} />
              ) : !daily.data && currentIndex === 0 ? (
                <div
                  key="empty"
                  className={cn(
                    hasNavigated.current &&
                      (slideDirection === "next" ? "animate-slide-in-right" : "animate-slide-in-left")
                  )}
                >
                  <HomeDailyEmpty isToday />
                </div>
              ) : currentItem ? (
                <div
                  key={`${currentItem.type}-${currentItem.experience.identity.slug}`}
                  className={cn(
                    hasNavigated.current &&
                      (slideDirection === "next" ? "animate-slide-in-right" : "animate-slide-in-left")
                  )}
                >
                  <DailyCuriosityCard
                    experience={currentItem.experience}
                    isCompleted={currentItem.isCompleted}
                    xpEarned={currentItem.xpEarned}
                    discoverySource={
                      currentItem.type === "daily"
                        ? { wasDailyFeature: true, wasRandomSpin: false }
                        : { wasDailyFeature: false, wasRandomSpin: true }
                    }
                    startLabel={currentItem.type === "daily" ? "Start today's curiosity" : "Start curiosity"}
                  />
                </div>
              ) : randomMutation.isPending ? (
                <DailyCuriosityCardSkeleton />
              ) : null}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={goToNext}
              disabled={randomMutation.isPending}
              aria-label="Next or skip to random curiosity"
              className="h-auto shrink-0 self-center rounded-full bg-white/95 p-2 shadow-md transition-transform hover:scale-110 disabled:opacity-50 dark:bg-slate-900/95"
            >
              <ArrowRightCircle className="h-8 w-8 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
            </Button>
          </div>
        </section>

        {/* 3. Discover button */}
        <section className="mt-6" aria-label="Discover more">
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
