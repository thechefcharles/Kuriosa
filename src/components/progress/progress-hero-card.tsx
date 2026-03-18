import type { UserProgressSummary } from "@/types/progress-view";
import { LevelProgressBar } from "@/components/progress/level-progress-bar";
import { Sparkles, Trophy } from "lucide-react";

export function ProgressHeroCard({ summary }: { summary: UserProgressSummary }) {
  const labelId = "level-progress-label";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-violet-200/60 bg-gradient-to-br from-violet-50 via-white to-cyan-50/80 p-6 shadow-md dark:border-white/10 dark:from-kuriosa-midnight-blue dark:via-slate-900 dark:to-slate-950 sm:p-8">
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-kuriosa-electric-cyan/15 blur-2xl"
        aria-hidden
      />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Your journey
          </p>
          <div className="mt-3 flex flex-wrap items-baseline gap-3">
            <span className="text-4xl font-bold tabular-nums text-kuriosa-midnight-blue dark:text-white sm:text-5xl">
              Level {summary.currentLevel}
            </span>
            <span className="text-sm text-muted-foreground">
              {summary.totalXP.toLocaleString()} total XP
            </span>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/60 px-3 py-2 dark:bg-white/5">
            <Trophy className="h-4 w-4 shrink-0 text-kuriosa-electric-cyan" aria-hidden />
            <span className="text-sm font-medium text-kuriosa-midnight-blue dark:text-slate-100">
              Curiosity score{" "}
              <span className="tabular-nums text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
                {summary.curiosityScore.toLocaleString()}
              </span>
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-8">
        <div className="mb-2 flex items-center justify-between text-xs sm:text-sm" id={labelId}>
          <span className="font-medium text-kuriosa-midnight-blue dark:text-slate-200">
            Progress to level {summary.currentLevel + 1}
          </span>
          <span className="tabular-nums text-muted-foreground">
            {summary.nextLevelXP.toLocaleString()} XP to go
          </span>
        </div>
        <LevelProgressBar progress={summary.currentLevelProgress} labelId={labelId} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {summary.xpIntoCurrentLevel.toLocaleString()} /{" "}
          {summary.xpRequiredForCurrentLevel.toLocaleString()} XP this level
        </p>
      </div>
    </div>
  );
}
