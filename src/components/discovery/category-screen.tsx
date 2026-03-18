"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageContainer } from "@/components/shared/page-container";
import { useCategoryDetail } from "@/hooks/queries/useCategoryDetail";
import { CategoryHero } from "@/components/discovery/category-hero";
import { CategoryTopicGrid } from "@/components/discovery/category-topic-grid";
import { CategoryEmptyState } from "@/components/discovery/category-empty-state";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function CategorySkeleton() {
  return (
    <div className="space-y-8" aria-busy="true">
      <div className="h-48 animate-pulse rounded-2xl bg-muted/80" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[176px] animate-pulse rounded-xl bg-muted/80" />
        ))}
      </div>
    </div>
  );
}

export function CategoryScreen({ slug }: { slug: string }) {
  const q = useCategoryDetail(slug);

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/80 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="pb-16 pt-6 sm:pt-8">
        <nav className="mb-6" aria-label="Breadcrumb">
          <Link
            href={ROUTES.discover}
            className="inline-flex items-center gap-1 text-sm font-medium text-kuriosa-electric-cyan hover:underline"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Discover
          </Link>
          <span className="mx-2 text-muted-foreground" aria-hidden>
            /
          </span>
          <span className="text-sm text-muted-foreground">
            {q.data?.category.name ?? (q.isPending ? "…" : "Category")}
          </span>
        </nav>

        {q.isPending ? (
          <CategorySkeleton />
        ) : q.isError ? (
          <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 px-6 py-10 text-center dark:border-amber-900/40 dark:bg-amber-950/20">
            <p className="font-medium text-amber-950 dark:text-amber-100">
              Couldn&apos;t load this category
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check your connection and try again.
            </p>
            <Link href={ROUTES.discover} className={cn(buttonVariants(), "mt-6")}>
              Back to Discover
            </Link>
          </div>
        ) : q.data === null ? (
          <div className="rounded-2xl border border-dashed px-6 py-12 text-center">
            <h1 className="text-xl font-bold text-kuriosa-midnight-blue dark:text-white">
              Category not found
            </h1>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              That path doesn&apos;t match a category. Head back to Discover and pick a lane.
            </p>
            <Link
              href={ROUTES.discover}
              className={cn(
                buttonVariants(),
                "mt-6 bg-kuriosa-deep-purple hover:bg-kuriosa-deep-purple/90"
              )}
            >
              Back to Discover
            </Link>
          </div>
        ) : (
          <>
            <CategoryHero category={q.data.category} />
            <div className="mt-10">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
                Curiosities in this category
              </h2>
              {q.data.topics.length === 0 ? (
                <CategoryEmptyState categoryName={q.data.category.name} />
              ) : (
                <CategoryTopicGrid topics={q.data.topics} />
              )}
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}
