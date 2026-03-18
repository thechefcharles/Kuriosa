"use client";

import Link from "next/link";
import { useUserProgressSummary } from "@/hooks/queries/useUserProgressSummary";
import { useUserProgressStats } from "@/hooks/queries/useUserProgressStats";
import { useUserBadges } from "@/hooks/queries/useUserBadges";
import { ProgressHeroCard } from "@/components/progress/progress-hero-card";
import { StreakCard } from "@/components/progress/streak-card";
import { StatGrid } from "@/components/progress/stat-grid";
import { BadgeGrid } from "@/components/progress/badge-grid";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { friendlyProgressLoadError } from "@/lib/ui/progress-load-error";

function ProgressSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-56 rounded-2xl bg-muted" />
      <div className="h-40 rounded-2xl bg-muted" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="h-48 rounded-2xl bg-muted" />
    </div>
  );
}

export function ProgressDashboard() {
  const summary = useUserProgressSummary();
  const stats = useUserProgressStats();
  const badges = useUserBadges();

  if (!summary.isAuthenticated && !summary.isPending) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-300/60 bg-gradient-to-b from-violet-50/50 to-transparent px-6 py-14 text-center dark:border-white/15">
        <h2 className="text-lg font-semibold text-kuriosa-midnight-blue dark:text-slate-100">
          Sign in to see your progress
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          XP, levels, streaks, and badges — all in one place once you&apos;re signed in.
        </p>
        <Link
          href={ROUTES.signIn}
          className={cn(
            buttonVariants({ size: "lg" }),
            "mt-6 bg-kuriosa-deep-purple hover:bg-kuriosa-deep-purple/90"
          )}
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (summary.isPending || stats.isPending || badges.isPending) {
    return <ProgressSkeleton />;
  }

  if (summary.error || stats.error || badges.error) {
    const raw =
      summary.error?.message ??
      stats.error?.message ??
      badges.error?.message ??
      "Unknown error";
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="font-medium text-destructive">Can&apos;t load progress</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {friendlyProgressLoadError(raw)}
        </p>
      </div>
    );
  }

  const s = summary.data;
  const st = stats.data;

  if (!s || !st) {
    return (
      <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
        Progress data isn&apos;t available yet. Finish a curiosity from the challenge
        screen, then come back here.
      </p>
    );
  }

  return (
    <div className="space-y-10 pb-10">
      <ProgressHeroCard summary={s} />
      <StreakCard streak={s.streak} />
      <StatGrid stats={st} />
      <BadgeGrid badges={badges.data} />
    </div>
  );
}
