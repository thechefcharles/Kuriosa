"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CompletionCelebrationPayload,
  RewardBreakdownPayload,
} from "@/lib/progress/completion-celebration-storage";
import { getCompletionMattersLine } from "@/lib/progress/completion-matters-line";
import {
  xpRequiredToAdvanceFromLevel,
  cumulativeXpForLevel,
} from "@/lib/progress/level-config";
import { X, Sparkles, TrendingUp, Flame, Award, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MOBILE_SAFE_ROUTES, ROUTES } from "@/lib/constants/routes";
import { useFeedRandomCuriosity, writeLastRandomSlug } from "@/hooks/mutations/useFeedRandomCuriosity";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { cn } from "@/lib/utils";

function xpBreakdownLines(b: RewardBreakdownPayload) {
  const lines: { label: string; xp: number }[] = [];
  const main = b.mainQuizXp ?? (b.lessonXp ?? 0) + (b.challengeXp ?? 0) + (b.perfectBonusXp ?? 0);
  if (main > 0) {
    const label = b.dailyMultiplierApplied
      ? `Quiz (${b.dailyMultiplierApplied}× daily)`
      : "Quiz";
    lines.push({ label, xp: main });
  }
  if ((b.bonusQuestionXp ?? 0) > 0) lines.push({ label: "Bonus question", xp: b.bonusQuestionXp! });
  if ((b.dailyBonusXp ?? 0) > 0) lines.push({ label: "Daily feature", xp: b.dailyBonusXp! });
  if ((b.randomBonusXp ?? 0) > 0) lines.push({ label: "Spin discovery", xp: b.randomBonusXp! });
  if ((b.listenBonusXp ?? 0) > 0) lines.push({ label: "Listen mode", xp: b.listenBonusXp! });
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
  const router = useRouter();
  const { mutateAsync: fetchRandom, isPending: isRandomPending } = useFeedRandomCuriosity();

  const leveledUp = payload.levelAfter > payload.levelBefore;
  const streakUp = payload.streakAfter > payload.streakBefore;
  const scoreUp = payload.curiosityScoreAfter > payload.curiosityScoreBefore;
  const hasBadges = payload.unlockedBadges.length > 0;
  const showXp = payload.wasCountedAsNewCompletion && payload.xpEarned > 0;
  const mattersLine = getCompletionMattersLine({
    wasCountedAsNewCompletion: payload.wasCountedAsNewCompletion,
    xpEarned: payload.xpEarned,
    levelBefore: payload.levelBefore,
    levelAfter: payload.levelAfter,
    streakBefore: payload.streakBefore,
    streakAfter: payload.streakAfter,
    curiosityScoreBefore: payload.curiosityScoreBefore,
    curiosityScoreAfter: payload.curiosityScoreAfter,
    breakdown: payload.breakdown,
    unlockedBadgesCount: payload.unlockedBadges.length,
  });
  const closeToLevel =
    !leveledUp &&
    showXp &&
    payload.xpToNextLevel != null &&
    payload.xpToNextLevel > 0 &&
    payload.xpToNextLevel <= 50;
  const breakdownLines = payload.breakdown ? xpBreakdownLines(payload.breakdown) : [];
  const xpRequired = xpRequiredToAdvanceFromLevel(payload.levelAfter);
  const xpToNext = payload.xpToNextLevel ?? xpRequired;
  const xpIntoLevel = Math.max(0, xpRequired - xpToNext);
  const totalXp = cumulativeXpForLevel(payload.levelAfter) + xpIntoLevel;
  const progressPercent = xpRequired > 0 ? Math.min(100, (xpIntoLevel / xpRequired) * 100) : 0;

  const [animatedPercent, setAnimatedPercent] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimatedPercent(progressPercent));
    });
    return () => cancelAnimationFrame(id);
  }, [progressPercent]);

  const hasBonusXp =
    payload.breakdown &&
    ((payload.breakdown.bonusQuestionXp ?? 0) > 0 ||
      (payload.breakdown.dailyMultiplierApplied ?? 0) > 0);

  const handleDiscover = () => {
    onDismiss();
    router.push(ROUTES.discover);
  };

  const handleNextCuriosity = async () => {
    try {
      const exp = await fetchRandom({
        dailyTopicSlug: payload.topicSlug,
      });
      if (exp) {
        writeLastRandomSlug(exp.identity.slug);
        setTopicDiscoveryContext(exp.identity.slug, {
          wasDailyFeature: false,
          wasRandomSpin: true,
        });
        onDismiss();
        router.push(MOBILE_SAFE_ROUTES.curiosity(exp.identity.slug));
      } else {
        onDismiss();
        router.push(ROUTES.discover);
      }
    } catch {
      onDismiss();
      router.push(ROUTES.discover);
    }
  };

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

      {/* Progress bar with animated fill + total XP hero */}
      {showXp && (
        <div className="mb-6">
          {/* Big total XP */}
          <div className="mb-4 flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold tabular-nums text-kuriosa-midnight-blue dark:text-white sm:text-6xl">
              {totalXp.toLocaleString()}
            </span>
            <span className="text-xl font-semibold text-muted-foreground sm:text-2xl">
              total XP
            </span>
          </div>

          {/* Gold progress bar with fill animation */}
          <div className="relative overflow-visible">
            <div className="h-6 overflow-hidden rounded-full bg-amber-200/60 dark:bg-amber-900/40">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] dark:from-amber-500 dark:via-amber-400 dark:to-yellow-500"
                style={{
                  width: `${animatedPercent}%`,
                  transition: "width 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              />
            </div>
            {/* +XP earned badge - rides the bar as it fills */}
            <div
              className="xp-earned-badge absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-amber-600 px-2.5 py-1 text-sm font-bold text-white shadow-lg dark:bg-amber-500"
              style={{
                left: `${Math.max(4, Math.min(animatedPercent, 96))}%`,
                transition: "left 1s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }}
            >
              +{payload.xpEarned} XP
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Level {payload.levelAfter}</span>
            {payload.xpToNextLevel != null && payload.xpToNextLevel > 0 && (
              <span>{payload.xpToNextLevel} to next level</span>
            )}
          </div>

          {leveledUp && (
            <p className="mt-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
              Level up! Now level {payload.levelAfter}
            </p>
          )}
        </div>
      )}

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
          {mattersLine ? (
            <p className="mt-1.5 text-sm text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
              {mattersLine}
            </p>
          ) : null}
          {closeToLevel ? (
            <p className="mt-1 text-xs text-muted-foreground">
              One more curiosity could do it.
            </p>
          ) : null}
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
                        ["Bonus question", "Perfect run", "First-try correct", "Daily feature", "Spin discovery", "Listen mode"].includes(label)
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
            <div className="flex items-center gap-2 font-semibold text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
              <Award className="h-4 w-4 shrink-0" aria-hidden />
              New badge{payload.unlockedBadges.length > 1 ? "s" : ""} unlocked
            </div>
            <ul className="mt-2 space-y-2 text-foreground">
              {payload.unlockedBadges.map((b) => (
                <li key={b.slug} className="text-sm">
                  <span className="font-semibold">{b.name}</span>
                  {b.description ? (
                    <span className="block mt-0.5 text-muted-foreground">
                      {b.description}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </li>
        ) : null}
      </ul>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-h-11 flex-1 gap-2"
          onClick={handleDiscover}
        >
          <Map className="h-4 w-4" aria-hidden />
          Back to Discover
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={isRandomPending}
          className={cn(
            "min-h-11 flex-1 gap-2",
            "bg-kuriosa-deep-purple hover:bg-kuriosa-deep-purple/90"
          )}
          onClick={() => void handleNextCuriosity()}
        >
          {isRandomPending ? (
            <span className="inline-flex gap-2">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden
              />
              Finding…
            </span>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden />
              Next curiosity
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
