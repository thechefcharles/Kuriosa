"use client";

import type { UserLeaderboardPosition } from "@/types/leaderboard";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserRankCardProps {
  position: UserLeaderboardPosition;
  window: string;
  isSignedIn: boolean;
}

function windowLabel(w: string): string {
  switch (w) {
    case "weekly":
      return "this week";
    case "monthly":
      return "this month";
    case "all_time":
      return "all time";
    default:
      return "the leaderboard";
  }
}

export function UserRankCard({
  position,
  window,
  isSignedIn,
}: UserRankCardProps) {
  if (!isSignedIn) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-violet-50/40 px-4 py-4 dark:border-white/10 dark:from-slate-900/60 dark:to-violet-950/30">
        <p className="text-sm text-muted-foreground">
          Sign in to see your rank and join the curiosity community.
        </p>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-50 to-violet-50/40 px-4 py-4 dark:border-white/10 dark:from-slate-900/60 dark:to-violet-950/30">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-amber-100/80 p-2 dark:bg-amber-900/40">
            <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Not ranked yet
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Explore a curiosity topic to earn your place {windowLabel(window)}.
              Every discovery counts.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { rank, score, totalEligible } = position;

  return (
    <div
      className={cn(
        "rounded-xl border border-violet-200/70 bg-gradient-to-br from-violet-50/80 to-slate-50 px-4 py-4",
        "dark:border-violet-800/50 dark:from-violet-950/50 dark:to-slate-900/60"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-foreground">
            Your rank {windowLabel(window)}
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums text-violet-700 dark:text-violet-300">
            #{rank}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">
            {score}
          </p>
          {totalEligible > 0 && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              of {totalEligible} explorers
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
