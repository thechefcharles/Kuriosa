"use client";

import { useRef } from "react";
import { CategoryCard } from "@/components/discovery/category-card";
import {
  DiscoverySectionError,
  DiscoverySectionEmpty,
} from "@/components/discovery/discovery-section-body";
import { ROUTES } from "@/lib/constants/routes";
import type { CategoryView } from "@/types/discovery";
import { cn } from "@/lib/utils";

export type DiscoverCategoryStripProps = {
  categories: CategoryView[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  searchActive?: boolean;
};

export function DiscoverCategoryStrip({
  categories,
  isLoading,
  isError,
  errorMessage = "Categories couldn't load. Try again.",
  searchActive = false,
}: DiscoverCategoryStripProps) {
  const scrollRef = useRef<HTMLUListElement>(null);

  if (isError) {
    return (
      <section
        className={cn(
          "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
          searchActive && "opacity-75"
        )}
        aria-label="Browse by category"
      >
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Browse by category
        </p>
        <DiscoverySectionError message={errorMessage} />
      </section>
    );
  }

  if (isLoading) {
    return (
      <section
        className={cn(
          "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
          searchActive && "opacity-75"
        )}
        aria-label="Browse by category"
      >
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Browse by category
        </p>
        <div className="flex gap-3 overflow-hidden" aria-busy="true">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-20 min-w-[130px] animate-pulse rounded-xl bg-muted/80"
            />
          ))}
        </div>
      </section>
    );
  }

  if (!categories?.length) {
    return (
      <section
        className={cn(
          "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
          searchActive && "opacity-75"
        )}
        aria-label="Browse by category"
      >
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Browse by category
        </p>
        <DiscoverySectionEmpty
          title="Categories coming soon"
          description="Topics will be grouped here once available."
        />
      </section>
    );
  }

  return (
    <section
      className={cn(
        "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
        searchActive && "opacity-75"
      )}
      aria-label="Browse by category"
    >
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Browse by category
      </p>
      <ul
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin [-webkit-overflow-scrolling:touch]"
        style={{ scrollbarWidth: "thin" }}
      >
        {categories.map((c) => (
          <li key={c.id} className="min-w-[130px] shrink-0">
            <CategoryCard
              category={c}
              href={ROUTES.discoverCategory(c.slug)}
              compact
              className="h-full min-h-[80px]"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
