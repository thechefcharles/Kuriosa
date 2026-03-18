import type { UserStreakView } from "@/types/progress-view";
import { Flame } from "lucide-react";

export function StreakCard({ streak }: { streak: UserStreakView }) {
  const { currentStreak, longestStreak } = streak;

  return (
    <div className="rounded-2xl border border-orange-200/50 bg-gradient-to-br from-amber-50/90 to-orange-50/50 p-5 shadow-sm dark:border-orange-900/30 dark:from-amber-950/40 dark:to-orange-950/20 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-md">
          <Flame className="h-6 w-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-orange-900/90 dark:text-amber-200">
            Streak
          </h3>
          <p className="mt-1 text-2xl font-bold tabular-nums text-kuriosa-midnight-blue dark:text-white">
            {currentStreak}{" "}
            <span className="text-base font-semibold text-muted-foreground">
              day{currentStreak === 1 ? "" : "s"} current
            </span>
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Best streak:{" "}
            <span className="font-semibold text-foreground">
              {longestStreak} day{longestStreak === 1 ? "" : "s"}
            </span>
            . Keep showing up — small steps build big habits.
          </p>
        </div>
      </div>
    </div>
  );
}
