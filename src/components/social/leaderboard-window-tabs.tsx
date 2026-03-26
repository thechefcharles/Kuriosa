"use client";

import type { LeaderboardWindow } from "@/types/leaderboard";
import { cn } from "@/lib/utils";

const WINDOWS: { value: LeaderboardWindow; label: string }[] = [
  { value: "weekly", label: "This Week" },
  { value: "monthly", label: "This Month" },
  { value: "all_time", label: "All Time" },
];

interface LeaderboardWindowTabsProps {
  value: LeaderboardWindow;
  onValueChange: (value: LeaderboardWindow) => void;
}

export function LeaderboardWindowTabs({
  value,
  onValueChange,
}: LeaderboardWindowTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Leaderboard time window"
      className="inline-flex rounded-lg bg-slate-100/80 p-1 dark:bg-slate-800/60"
    >
      {WINDOWS.map((w) => (
        <button
          key={w.value}
          role="tab"
          type="button"
          aria-selected={value === w.value}
          onClick={() => onValueChange(w.value)}
          className={cn(
            "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
            value === w.value
              ? "bg-white text-foreground shadow-sm dark:bg-slate-700 dark:text-foreground"
              : "text-muted-foreground hover:text-foreground dark:hover:text-foreground"
          )}
        >
          {w.label}
        </button>
      ))}
    </div>
  );
}
