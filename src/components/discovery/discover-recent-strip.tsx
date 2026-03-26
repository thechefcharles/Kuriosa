"use client";

import Link from "next/link";
import { History } from "lucide-react";
import { MOBILE_SAFE_ROUTES, ROUTES } from "@/lib/constants/routes";
import type { RecentTopicView } from "@/types/discovery";
import { cn } from "@/lib/utils";

const RECENT_LIMIT = 5;

export type DiscoverRecentStripProps = {
  isAuthenticated: boolean;
  recent: RecentTopicView[] | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  searchActive?: boolean;
};

export function DiscoverRecentStrip({
  isAuthenticated,
  recent,
  isLoading,
  isError,
  errorMessage = "Recent didn't load. Try again.",
  searchActive = false,
}: DiscoverRecentStripProps) {
  if (!isAuthenticated) {
    return (
      <section
        className={cn(
          "mb-4 rounded-2xl border border-dashed border-slate-200/70 bg-white/50 px-4 py-4 dark:border-white/10 dark:bg-slate-900/30",
          searchActive && "opacity-75"
        )}
        aria-label="Recently explored"
      >
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Pick up where you left off
        </p>
        <p className="text-sm text-muted-foreground">
          Sign in to see your recent curiosities.
        </p>
        <Link
          href={ROUTES.signIn}
          className="mt-2 inline-block text-sm font-semibold text-kuriosa-electric-cyan hover:underline"
        >
          Sign in
        </Link>
      </section>
    );
  }

  if (isError) {
    return (
      <section
        className={cn(
          "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
          searchActive && "opacity-75"
        )}
        aria-label="Recently explored"
      >
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Recent
        </p>
        <p className="text-sm text-amber-700 dark:text-amber-200">{errorMessage}</p>
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
        aria-label="Recently explored"
      >
        <p className="mb-3 text-sm font-medium text-muted-foreground">
          Recent
        </p>
        <div className="space-y-2" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-12 animate-pulse rounded-xl bg-muted/80"
            />
          ))}
        </div>
      </section>
    );
  }

  const items = (recent ?? []).slice(0, RECENT_LIMIT);

  if (items.length === 0) {
    return (
      <section
        className={cn(
          "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
          searchActive && "opacity-75"
        )}
        aria-label="Recently explored"
      >
        <p className="mb-2 text-sm font-medium text-muted-foreground">
          Recent
        </p>
        <p className="text-sm text-muted-foreground">
          Finish a curiosity and it&apos;ll appear here.
        </p>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "mb-4 rounded-2xl border border-slate-200/70 bg-white/60 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
        searchActive && "opacity-75"
      )}
      aria-label="Recently explored"
    >
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        Pick up where you left off
      </p>
      <ul className="space-y-2">
        {items.map((r) => (
          <li key={r.id}>
            <Link
              href={MOBILE_SAFE_ROUTES.curiosity(r.slug)}
              className="flex min-h-[44px] items-center gap-3 rounded-xl border border-slate-200/90 bg-white/90 px-4 py-3 transition-colors hover:border-kuriosa-electric-cyan/35 hover:bg-white dark:border-white/10 dark:bg-slate-900/60 dark:hover:border-kuriosa-electric-cyan/30"
            >
              <History
                className="h-5 w-5 shrink-0 text-kuriosa-electric-cyan"
                aria-hidden
              />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-kuriosa-midnight-blue dark:text-white">
                  {r.title}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {r.categoryName}
                </p>
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
    </section>
  );
}
