import type { CompletionCelebrationPayload } from "@/lib/progress/completion-celebration-storage";
import { X, Sparkles, TrendingUp, Flame, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CompletionCelebrationCard({
  payload,
  onDismiss,
}: {
  payload: CompletionCelebrationPayload;
  onDismiss: () => void;
}) {
  const leveledUp = payload.levelAfter > payload.levelBefore;
  const streakUp = payload.streakAfter > payload.streakBefore;
  const scoreUp = payload.curiosityScoreAfter > payload.curiosityScoreBefore;
  const hasBadges = payload.unlockedBadges.length > 0;
  const showXp = payload.wasCountedAsNewCompletion && payload.xpEarned > 0;

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-2xl border border-violet-300/50 bg-gradient-to-br from-violet-50 via-white to-cyan-50/90 p-5 shadow-lg dark:border-kuriosa-electric-cyan/20 dark:from-kuriosa-midnight-blue dark:via-slate-900 dark:to-slate-950 sm:p-6"
      role="status"
    >
      <div
        className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-kuriosa-electric-cyan/20 blur-2xl"
        aria-hidden
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 text-muted-foreground"
        onClick={onDismiss}
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </Button>

      <div className="flex gap-3 pr-10">
        <Sparkles
          className="mt-0.5 h-6 w-6 shrink-0 text-kuriosa-electric-cyan"
          aria-hidden
        />
        <div>
          <h2 className="text-lg font-bold leading-snug text-kuriosa-midnight-blue dark:text-white sm:text-xl">
            {showXp
              ? "You earned it"
              : hasBadges
                ? "New badge unlocked"
                : "Saved"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {showXp
              ? "Here’s what changed."
              : "Your progress is up to date."}
          </p>
        </div>
      </div>

      <ul className="mt-4 space-y-3 text-sm">
        {showXp ? (
          <li className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 dark:bg-white/5">
            <TrendingUp className="h-4 w-4 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
            <span>
              <strong className="tabular-nums text-kuriosa-midnight-blue dark:text-white">
                +{payload.xpEarned} XP
              </strong>
              {leveledUp ? (
                <span className="text-muted-foreground">
                  {" "}
                  — Level up! Now level {payload.levelAfter}
                </span>
              ) : (
                <span className="text-muted-foreground"> toward your next level</span>
              )}
            </span>
          </li>
        ) : null}

        {!showXp && leveledUp ? (
          <li className="flex items-center gap-2 font-medium text-kuriosa-midnight-blue dark:text-white">
            Level {payload.levelAfter}
          </li>
        ) : null}

        {streakUp ? (
          <li className="flex items-center gap-2 rounded-lg bg-amber-50/80 px-3 py-2 dark:bg-amber-950/30">
            <Flame className="h-4 w-4 text-orange-500" />
            <span>
              Streak: <strong>{payload.streakAfter}</strong> day
              {payload.streakAfter === 1 ? "" : "s"}
            </span>
          </li>
        ) : null}

        {scoreUp ? (
          <li className="text-muted-foreground">
            Curiosity score{" "}
            <span className="font-semibold text-foreground">
              {payload.curiosityScoreBefore} → {payload.curiosityScoreAfter}
            </span>
          </li>
        ) : null}

        {hasBadges ? (
          <li className="rounded-lg border border-violet-200/60 bg-violet-50/50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center gap-2 font-medium text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
              <Award className="h-4 w-4" />
              New badge{payload.unlockedBadges.length > 1 ? "s" : ""}
            </div>
            <ul className="mt-2 space-y-1 text-foreground">
              {payload.unlockedBadges.map((b) => (
                <li key={b.slug} className="text-sm">
                  {b.name}
                </li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>

      <Button
        type="button"
        className={cn(
          "mt-4 w-full sm:w-auto",
          "bg-kuriosa-deep-purple hover:bg-kuriosa-deep-purple/90"
        )}
        onClick={onDismiss}
      >
        Got it
      </Button>
    </div>
  );
}
