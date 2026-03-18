"use client";

/**
 * Phase 6.4 dev verification only — not the final dashboard (6.5).
 */

import { useUserProgressSummary } from "@/hooks/queries/useUserProgressSummary";
import { useUserProgressStats } from "@/hooks/queries/useUserProgressStats";
import { useUserBadges } from "@/hooks/queries/useUserBadges";
import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ProgressDataVerificationPanel() {
  const summary = useUserProgressSummary();
  const stats = useUserProgressStats();
  const badges = useUserBadges();

  if (!summary.isAuthenticated && !summary.isPending) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Sign in to load progress data.
        </p>
        <Link
          href={ROUTES.signIn}
          className={cn(
            buttonVariants({ variant: "outline" }),
            "mt-4 inline-flex"
          )}
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (summary.isPending || stats.isPending || badges.isPending) {
    return (
      <div className="space-y-3 rounded-lg border p-6">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-full max-w-md animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (summary.error || stats.error || badges.error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        <p className="font-medium text-destructive">Could not load progress</p>
        <p className="mt-1 text-muted-foreground">
          {summary.error?.message ??
            stats.error?.message ??
            badges.error?.message}
        </p>
      </div>
    );
  }

  const s = summary.data;
  const st = stats.data;

  if (!s || !st) {
    return (
      <p className="text-sm text-muted-foreground">
        No profile data yet. Complete a curiosity to initialize progress.
      </p>
    );
  }

  return (
    <div className="space-y-6 rounded-lg border bg-card p-6 text-sm shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-amber-700 dark:text-amber-400">
        6.4 verification — replace with dashboard UI in 6.5
      </p>

      <section>
        <h3 className="mb-2 font-semibold">Summary</h3>
        <ul className="grid gap-1 text-muted-foreground sm:grid-cols-2">
          <li>Total XP: {s.totalXP}</li>
          <li>Level: {s.currentLevel}</li>
          <li>
            Level bar: {(s.currentLevelProgress * 100).toFixed(1)}% (
            {s.xpIntoCurrentLevel} / {s.xpRequiredForCurrentLevel} XP this level)
          </li>
          <li>XP to next level: {s.nextLevelXP}</li>
          <li>Curiosity score: {s.curiosityScore}</li>
          <li>Current streak: {s.streak.currentStreak}</li>
          <li>Longest streak: {s.streak.longestStreak}</li>
          <li>Last active: {s.streak.lastActiveDate ?? "—"}</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">Stats</h3>
        <ul className="grid gap-1 text-muted-foreground sm:grid-cols-2">
          <li>Topics completed: {st.totalTopicsCompleted}</li>
          <li>Categories explored: {st.categoriesExplored}</li>
          <li>Badges earned: {st.badgesEarned}</li>
          <li>Random completions: {st.randomCompletionsCount}</li>
          <li>Perfect challenges: {st.perfectChallengesCount}</li>
        </ul>
      </section>

      <section>
        <h3 className="mb-2 font-semibold">
          Badges ({badges.data.length})
        </h3>
        {badges.data.length === 0 ? (
          <p className="text-muted-foreground">No badges yet.</p>
        ) : (
          <ul className="max-h-48 space-y-2 overflow-y-auto text-muted-foreground">
            {badges.data.slice(0, 12).map((b) => (
              <li key={b.badgeId}>
                <span className="font-medium text-foreground">{b.name}</span>{" "}
                <code className="text-xs">({b.slug})</code>
                <span className="ml-2 text-xs">
                  {new Date(b.earnedAt).toLocaleString()}
                </span>
              </li>
            ))}
            {badges.data.length > 12 ? (
              <li className="text-xs">…and {badges.data.length - 12} more</li>
            ) : null}
          </ul>
        )}
      </section>

      {st.recentBadgeUnlocks.length > 0 ? (
        <section>
          <h3 className="mb-2 font-semibold">Recent unlocks (stats slice)</h3>
          <ul className="text-xs text-muted-foreground">
            {st.recentBadgeUnlocks.map((b) => (
              <li key={b.badgeId}>{b.name}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
