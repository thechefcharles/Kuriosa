"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { Map, Sparkles, TrendingUp, Flame, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import {
  xpRequiredToAdvanceFromLevel,
  cumulativeXpForLevel,
} from "@/lib/progress/level-config";
import type { ProgressUpdateSuccess } from "@/types/progress";
import { useFeedRandomCuriosity, writeLastRandomSlug } from "@/hooks/mutations/useFeedRandomCuriosity";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { cn } from "@/lib/utils";

function fireConfetti() {
  const count = 120;
  const defaults = {
    origin: { y: 0.7 },
    spread: 100,
    startVelocity: 35,
    zIndex: 9999,
  };
  confetti({
    ...defaults,
    particleCount: count,
    colors: ["#8B5CF6", "#06B6D4", "#F59E0B", "#10B981", "#EC4899"],
  });
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.25),
    spread: 120,
    origin: { x: 0.2, y: 0.6 },
  });
  confetti({
    ...defaults,
    particleCount: Math.floor(count * 0.25),
    spread: 120,
    origin: { x: 0.8, y: 0.6 },
  });
}

function xpBreakdownLines(d: ProgressUpdateSuccess) {
  const b = d.breakdown;
  if (!b) return [];
  const lines: { label: string; xp: number }[] = [];
  if (b.lessonXp > 0) lines.push({ label: "Lesson", xp: b.lessonXp });
  if (b.challengeXp > 0) lines.push({ label: "Challenge", xp: b.challengeXp });
  if (b.perfectBonusXp > 0) lines.push({ label: "Perfect run", xp: b.perfectBonusXp });
  if (b.bonusQuestionXp > 0) lines.push({ label: "Bonus question", xp: b.bonusQuestionXp });
  if (b.firstTryBonusXp > 0) lines.push({ label: "First-try correct", xp: b.firstTryBonusXp });
  if (b.dailyBonusXp > 0) lines.push({ label: "Daily feature", xp: b.dailyBonusXp });
  if (b.randomBonusXp > 0) lines.push({ label: "Spin discovery", xp: b.randomBonusXp });
  if (b.listenBonusXp > 0) lines.push({ label: "Listen mode", xp: b.listenBonusXp });
  return lines;
}

export function QuizSuccessCelebration({
  data,
  onComplete,
  currentSlug,
}: {
  data: ProgressUpdateSuccess;
  /** Called when user chooses an action (Discover or Next) */
  onComplete?: () => void;
  /** Current topic slug (for random exclude) */
  currentSlug: string;
}) {
  const router = useRouter();
  const { mutateAsync: fetchRandom, isPending: isRandomPending } = useFeedRandomCuriosity();
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, []);

  const leveledUp = data.levelAfter > data.levelBefore;
  const streakUp = data.streakAfter > data.streakBefore;
  const hasBadges = data.unlockedBadges.length > 0;
  const showXp = data.wasCountedAsNewCompletion && data.xpEarned > 0;

  const xpRequired = xpRequiredToAdvanceFromLevel(data.levelAfter);
  const xpToNext = data.xpToNextLevel ?? xpRequired;
  const xpIntoLevel = Math.max(0, xpRequired - xpToNext);
  const totalXp = cumulativeXpForLevel(data.levelAfter) + xpIntoLevel;
  const progressPercent = xpRequired > 0 ? Math.min(100, (xpIntoLevel / xpRequired) * 100) : 0;

  const breakdownLines = xpBreakdownLines(data);

  const handleDiscover = () => {
    onComplete?.();
    router.push(ROUTES.discover);
  };

  const handleNextCuriosity = async () => {
    try {
      const exp = await fetchRandom({
        dailyTopicSlug: currentSlug,
      });
      if (exp) {
        writeLastRandomSlug(exp.identity.slug);
        setTopicDiscoveryContext(exp.identity.slug, {
          wasDailyFeature: false,
          wasRandomSpin: true,
        });
        onComplete?.();
        router.push(ROUTES.curiosity(exp.identity.slug));
      } else {
        onComplete?.();
        router.push(ROUTES.discover);
      }
    } catch {
      onComplete?.();
      router.push(ROUTES.discover);
    }
  };

  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-2xl border border-violet-300/50 bg-gradient-to-br from-violet-50 via-white to-cyan-50/90 p-6 shadow-xl dark:border-kuriosa-electric-cyan/20 dark:from-kuriosa-midnight-blue dark:via-slate-900 dark:to-slate-950"
      role="status"
      aria-live="polite"
    >
      {/* XP earned - hero */}
      {showXp && (
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
            You earned
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-kuriosa-midnight-blue dark:text-white sm:text-5xl">
            +{data.xpEarned} XP
          </p>
          {leveledUp && (
            <p className="mt-2 text-lg font-semibold text-emerald-600 dark:text-emerald-400">
              Level up! Now level {data.levelAfter}
            </p>
          )}
        </div>
      )}

      {/* Progress bar */}
      {showXp && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>{totalXp.toLocaleString()} total XP · Level {data.levelAfter}</span>
            {data.xpToNextLevel != null && data.xpToNextLevel > 0 && (
              <span>{data.xpToNextLevel} to next</span>
            )}
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-gradient-to-r from-kuriosa-deep-purple to-kuriosa-electric-cyan transition-all duration-700 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Breakdown */}
      {breakdownLines.length > 0 && (
        <ul className="mb-6 space-y-1.5 rounded-lg bg-white/70 px-3 py-2 dark:bg-white/5">
          {breakdownLines.map(({ label, xp }) => (
            <li key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="tabular-nums font-semibold text-kuriosa-midnight-blue dark:text-white">
                +{xp}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* Streak */}
      {streakUp && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-amber-50/80 px-3 py-2 dark:bg-amber-950/30">
          <Flame className="h-4 w-4 shrink-0 text-orange-500" />
          <span className="text-sm font-medium">
            <strong>{data.streakAfter}</strong> day streak
            {data.streakAfter === 1 ? "" : "s"} — keep it going
          </span>
        </div>
      )}

      {/* Badges */}
      {hasBadges && (
        <div className="mb-6 rounded-lg border border-violet-200/60 bg-violet-50/50 px-3 py-2 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center gap-2 font-semibold text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
            <Award className="h-4 w-4 shrink-0" aria-hidden />
            New badge{data.unlockedBadges.length > 1 ? "s" : ""} unlocked
          </div>
          <ul className="mt-2 space-y-2 text-foreground">
            {data.unlockedBadges.map((b) => (
              <li key={b.slug} className="text-sm">
                <span className="font-semibold">{b.name}</span>
                {b.description ? (
                  <span className="block mt-0.5 text-muted-foreground">{b.description}</span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* No XP but saved */}
      {!showXp && !hasBadges && (
        <p className="mb-6 text-center text-sm text-muted-foreground">
          Your progress is up to date.
        </p>
      )}

      {/* CTAs */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-h-12 flex-1 gap-2"
          onClick={handleDiscover}
        >
          <Map className="h-4 w-4" aria-hidden />
          Back to Discover
        </Button>
        <Button
          type="button"
          size="lg"
          disabled={isRandomPending}
          className="min-h-12 flex-1 gap-2 bg-kuriosa-deep-purple hover:bg-kuriosa-deep-purple/90"
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
