"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import { PageContainer } from "@/components/shared/page-container";
import { useCategoryProgress } from "@/hooks/queries/useCategoryProgress";
import { useUserCategoryXp } from "@/hooks/queries/useUserCategoryXp";
import { CategoryProgressCard } from "@/components/progress/category-progress-card";
import { MOBILE_SAFE_ROUTES, ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 4;
const SWIPE_THRESHOLD = 72;

export function CategoryProgressScreen({ slug }: { slug: string }) {
  const categoryXp = useUserCategoryXp();
  const completedTopics = useCategoryProgress(slug);

  const entry = categoryXp.data?.find((e) => e.categorySlug === slug);
  const topics = completedTopics.data ?? [];
  const categoryName = entry?.categoryName ?? topics[0]?.categoryName ?? "Category";
  const totalXp =
    entry?.totalXp ?? topics.reduce((sum, t) => sum + t.xpEarned, 0);

  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(topics.length / PAGE_SIZE));
  const clampedPage = Math.min(page, totalPages - 1);
  const start = clampedPage * PAGE_SIZE;
  const topicsToShow = topics.slice(start, start + PAGE_SIZE);

  const canGoPrev = clampedPage > 0;
  const canGoNext = clampedPage < totalPages - 1;

  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const touchStartTarget = useRef<EventTarget | null>(null);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      if (direction === "right" && canGoPrev) setPage((p) => Math.max(0, p - 1));
      else if (direction === "left" && canGoNext) setPage((p) => Math.min(totalPages - 1, p + 1));
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

  // Progress bar: fill based on progress to next 100 XP
  const progressFill = totalXp > 0 ? ((totalXp % 100) / 100) * 100 : 0;

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/85 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="max-w-lg pb-16 pt-5 sm:pt-6">
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link
            href={ROUTES.progress}
            className="inline-flex items-center gap-1 text-sm font-medium text-kuriosa-electric-cyan hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Progress
          </Link>
          <span className="mx-2 text-muted-foreground" aria-hidden>
            /
          </span>
          <span className="text-sm text-muted-foreground">{categoryName}</span>
        </nav>

        {completedTopics.isPending || categoryXp.isPending ? (
          <div className="space-y-6" aria-busy="true">
            <div className="h-28 animate-pulse rounded-2xl bg-muted/80" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-[220px] animate-pulse rounded-xl bg-muted/80" />
              ))}
            </div>
          </div>
        ) : completedTopics.isError ? (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-6 py-10 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="font-medium text-amber-950 dark:text-amber-100">
              Couldn&apos;t load category progress
            </p>
            <Link href={ROUTES.progress} className="mt-4 inline-block text-sm underline">
              Back to Progress
            </Link>
          </div>
        ) : topics.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 px-6 py-12 text-center dark:border-slate-700">
            <h1 className="text-xl font-bold text-kuriosa-midnight-blue dark:text-white">
              No completions yet
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Complete curiosities in this category to see your progress here.
            </p>
            <Link
              href={MOBILE_SAFE_ROUTES.discoverCategory(slug)}
              className="mt-6 inline-flex items-center rounded-lg bg-kuriosa-deep-purple px-4 py-2 text-sm font-medium text-white hover:bg-kuriosa-deep-purple/90"
            >
              Browse {categoryName}
            </Link>
          </div>
        ) : (
          <>
            {/* Progress bar */}
            <section className="mb-8" aria-label="Category XP progress">
              <div className="rounded-2xl border border-slate-200/90 bg-white/90 p-5 shadow-sm dark:border-white/15 dark:bg-slate-900/60">
                <div className="mb-2 flex items-baseline justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
                    {categoryName} XP
                  </h2>
                  <span className="text-2xl font-bold tabular-nums text-kuriosa-midnight-blue dark:text-white">
                    {totalXp.toLocaleString()} XP
                  </span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-kuriosa-electric-cyan transition-all duration-500"
                    style={{ width: `${progressFill}%` }}
                  />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Progress to next 100 XP
                </p>
              </div>
            </section>

            {/* Completed cards carousel */}
            <section aria-label="Completed curiosities">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
                Completed ({topics.length})
              </h2>
              <div
                className="relative"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
              >
                {totalPages > 1 && (
                  <>
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
                  </>
                )}
                <ul
                  className={cn(
                    "grid grid-cols-2 gap-4 sm:gap-5",
                    totalPages > 1 && "px-12"
                  )}
                >
                  {topicsToShow.map((t) => (
                    <li key={t.id}>
                      <CategoryProgressCard topic={t} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </>
        )}
      </PageContainer>
    </div>
  );
}
