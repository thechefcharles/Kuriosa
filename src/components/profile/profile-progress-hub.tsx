"use client";

import Link from "next/link";
import { useUserProfileProgress } from "@/hooks/queries/useUserProfileProgress";
import { useUserBadges } from "@/hooks/queries/useUserBadges";
import { LevelProgressBar } from "@/components/progress/level-progress-bar";
import { BadgeCard } from "@/components/progress/badge-card";
import { Flame, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { cn } from "@/lib/utils";
import { friendlyProgressLoadError } from "@/lib/ui/progress-load-error";

function displayName(
  displayName: string | null,
  username: string | null
): string {
  if (displayName?.trim()) return displayName.trim();
  if (username?.trim()) return username.trim();
  return "Curious explorer";
}

export function ProfileProgressHub() {
  const profile = useUserProfileProgress();
  const badges = useUserBadges();

  if (!profile.isAuthenticated && !profile.isPending) {
    return (
      <div className="rounded-2xl border border-dashed p-8 text-center">
        <p className="text-muted-foreground">Sign in to view your profile.</p>
        <Link href={ROUTES.signIn} className={cn(buttonVariants(), "mt-4")}>
          Sign in
        </Link>
      </div>
    );
  }

  if (profile.isPending || badges.isPending) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-32 rounded-2xl bg-muted" />
        <div className="h-24 rounded-xl bg-muted" />
      </div>
    );
  }

  if (profile.error) {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm">
        <p className="font-medium text-destructive">Couldn&apos;t load profile</p>
        <p className="mt-1 text-muted-foreground">
          {friendlyProgressLoadError(profile.error.message)}
        </p>
      </div>
    );
  }

  const p = profile.data;
  if (!p) {
    return <p className="text-sm text-muted-foreground">Profile unavailable.</p>;
  }

  const { summary: s } = p;
  const recent = badges.data.slice(0, 4);
  const labelId = "profile-level-bar";

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-violet-200/50 bg-gradient-to-b from-white to-violet-50/40 p-6 text-center shadow-sm dark:border-white/10 dark:from-slate-900 dark:to-kuriosa-midnight-blue/60 sm:flex-row sm:items-center sm:text-left">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-kuriosa-electric-cyan/40 bg-gradient-to-br from-kuriosa-deep-purple to-kuriosa-electric-cyan shadow-md">
          {p.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- user-provided URL; domains vary
            <img
              src={p.avatarUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl font-bold text-white">
              {displayName(p.displayName, p.username).slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-kuriosa-midnight-blue dark:text-white">
            {displayName(p.displayName, p.username)}
          </h2>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-kuriosa-deep-purple/10 px-3 py-1 text-sm font-semibold text-kuriosa-deep-purple dark:bg-kuriosa-electric-cyan/15 dark:text-kuriosa-electric-cyan">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Level {s.currentLevel}
            </span>
            <span className="text-sm text-muted-foreground">
              Score <strong className="text-foreground">{s.curiosityScore}</strong>
            </span>
            <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
              <Flame className="h-3.5 w-3.5 text-orange-500" aria-hidden />
              <strong className="text-foreground">{s.streak.currentStreak}</strong> day streak
            </span>
          </div>
          <div className="mt-4 max-w-md">
            <div className="mb-1 flex justify-between text-xs text-muted-foreground" id={labelId}>
              <span>Next level</span>
              <span className="tabular-nums">{s.nextLevelXP} XP left</span>
            </div>
            <LevelProgressBar progress={s.currentLevelProgress} labelId={labelId} />
          </div>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
            Recent badges
          </h3>
          <Link
            href={ROUTES.progress}
            className="text-xs font-medium text-kuriosa-electric-cyan hover:underline"
          >
            View all
          </Link>
        </div>
        {!recent.length ? (
          <p className="rounded-xl border border-dashed py-8 text-center text-sm text-muted-foreground">
            First badge is never far — finish any curiosity from start to challenge.
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {recent.map((b) => (
              <li key={b.badgeId}>
                <BadgeCard badge={b} compact />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
