"use client";

import type { LeaderboardEntryView } from "@/types/leaderboard";
import { cn } from "@/lib/utils";

interface LeaderboardRowProps {
  entry: LeaderboardEntryView;
}

function displayLabel(entry: LeaderboardEntryView): string {
  return entry.displayName?.trim() || "Explorer";
}

export function LeaderboardRow({ entry }: LeaderboardRowProps) {
  const label = displayLabel(entry);
  const isYou = entry.isCurrentUser;

  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg px-4 py-3",
        isYou && "bg-violet-50/80 ring-1 ring-violet-200/60 dark:bg-violet-950/40 dark:ring-violet-800/50"
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
          entry.rank <= 3
            ? "bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200"
            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
        )}
      >
        {entry.rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate text-sm font-medium text-foreground">
          {label}
          {isYou && (
            <span className="shrink-0 rounded-full bg-violet-200/70 px-2 py-0.5 text-xs font-medium text-violet-800 dark:bg-violet-800/50 dark:text-violet-200">
              You
            </span>
          )}
        </p>
        {(entry.topicsExplored != null || entry.level != null) && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {entry.topicsExplored != null && (
              <span>{entry.topicsExplored} topics explored</span>
            )}
            {entry.topicsExplored != null && entry.level != null && " · "}
            {entry.level != null && <span>Level {entry.level}</span>}
          </p>
        )}
      </div>
      <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
        {entry.score}
      </span>
    </div>
  );
}
