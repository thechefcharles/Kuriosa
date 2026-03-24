import type {
  CompletionCelebrationPayload,
  RewardBreakdownPayload,
} from "@/lib/progress/completion-celebration-storage";
import { X, Sparkles, TrendingUp, Flame, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function xpBreakdownLines(b: RewardBreakdownPayload) {
  const lines: { label: string; xp: number }[] = [];
  if (b.lessonXp > 0) lines.push({ label: "Lesson", xp: b.lessonXp });
  if (b.challengeXp > 0) lines.push({ label: "Challenge", xp: b.challengeXp });
  if (b.perfectBonusXp > 0) lines.push({ label: "Perfect run", xp: b.perfectBonusXp });
  if (b.bonusQuestionXp > 0) lines.push({ label: "Bonus question", xp: b.bonusQuestionXp });
  if (b.dailyBonusXp > 0) lines.push({ label: "Daily feature", xp: b.dailyBonusXp });
  if (b.randomBonusXp > 0) lines.push({ label: "Spin discovery", xp: b.randomBonusXp });
  if (b.listenBonusXp > 0) lines.push({ label: "Listen mode", xp: b.listenBonusXp });
  return lines;
}

export function CompletionCelebrationCard({
  payload,
  onDismiss,
  sessionCompletionCount,
}: {
  payload: CompletionCelebrationPayload;
  onDismiss: () => void;
  /** Curiosities completed this session (today); for "You're on a roll" arc */
  sessionCompletionCount?: number;
}) {
  const leveledUp = payload.levelAfter > payload.levelBefore;
  const streakUp = payload.streakAfter > payload.streakBefore;
  const scoreUp = payload.curiosityScoreAfter > payload.curiosityScoreBefore;
  const hasBadges = payload.unlockedBadges.length > 0;
  const showXp = payload.wasCountedAsNewCompletion && payload.xpEarned > 0;
  const breakdownLines = payload.breakdown ? xpBreakdownLines(payload.breakdown) : [];
  const hasBonusXp =
    payload.breakdown &&
    (payload.breakdown.perfectBonusXp > 0 ||
      payload.breakdown.bonusQuestionXp > 0 ||
      payload.breakdown.dailyBonusXp > 0 ||
      payload.breakdown.randomBonusXp > 0 ||
      payload.breakdown.listenBonusXp > 0);

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
              ? "Nice work"
              : hasBadges
                ? "New badge unlocked"
                : "Saved"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {showXp
              ? "Here’s what you earned."
              : "Your progress is up to date."}
          </p>
          {sessionCompletionCount != null && sessionCompletionCount >= 2 ? (
            <p className="mt-2 text-sm font-medium text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
              {sessionCompletionCount === 2 ? "You're on a roll" : `${sessionCompletionCount} curiosities explored today`}
            </p>
          ) : null}
        </div>
      </div>

      <ul className="mt-4 space-y-3 text-sm">
        {showXp ? (
          <li className="rounded-lg bg-white/70 px-3 py-2 dark:bg-white/5">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 shrink-0 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
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
            </div>
            {breakdownLines.length > 0 ? (
              <ul className="mt-2 space-y-1 border-t border-violet-200/40 pt-2 dark:border-white/10">
                {breakdownLines.map(({ label, xp }) => (
                  <li
                    key={label}
                    className={cn(
                      "flex justify-between text-xs",
                      hasBonusXp &&
                        ["Bonus question", "Perfect run", "Daily feature", "Spin discovery", "Listen mode"].includes(label)
                        ? "text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan"
                        : "text-muted-foreground"
                    )}
                  >
                    <span>{label}</span>
                    <span className="tabular-nums font-medium">+{xp}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ) : null}

        {!showXp && leveledUp ? (
          <li className="flex items-center gap-2 font-medium text-kuriosa-midnight-blue dark:text-white">
            Level {payload.levelAfter}
          </li>
        ) : null}

        {streakUp ? (
          <li className="flex items-center gap-2 rounded-lg bg-amber-50/80 px-3 py-2 dark:bg-amber-950/30">
            <Flame className="h-4 w-4 shrink-0 text-orange-500" />
            <span>
              <strong>{payload.streakAfter}</strong> day streak
              {payload.streakAfter === 1 ? "" : "s"} — keep it going
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
              <Award className="h-4 w-4 shrink-0" />
              New badge{payload.unlockedBadges.length > 1 ? "s" : ""}
            </div>
            <ul className="mt-2 space-y-1.5 text-foreground">
              {payload.unlockedBadges.map((b) => (
                <li key={b.slug} className="text-sm">
                  <span className="font-medium">{b.name}</span>
                  {b.description ? (
                    <span className="text-muted-foreground"> — {b.description}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>

      <Button
        type="button"
        className={cn(
          "mt-4 min-h-11 w-full sm:w-auto",
          "bg-kuriosa-deep-purple hover:bg-kuriosa-deep-purple/90"
        )}
        onClick={onDismiss}
      >
        Got it
      </Button>
    </div>
  );
}
