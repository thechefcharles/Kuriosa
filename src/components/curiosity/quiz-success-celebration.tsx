"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Map, Sparkles, Flame, Award } from "lucide-react";
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

function xpBreakdownLines(d: ProgressUpdateSuccess) {
  const b = d.breakdown;
  if (!b) return [];
  const lines: { label: string; xp: number }[] = [];
  if ((b.mainQuizXp ?? 0) > 0) {
    const label = b.dailyMultiplierApplied
      ? `Quiz (${b.dailyMultiplierApplied}× daily)`
      : "Quiz";
    lines.push({ label, xp: b.mainQuizXp! });
  }
  if ((b.bonusQuestionXp ?? 0) > 0) lines.push({ label: "Bonus question", xp: b.bonusQuestionXp! });
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

  const leveledUp = data.levelAfter > data.levelBefore;
  const streakUp = data.streakAfter > data.streakBefore;
  const hasBadges = data.unlockedBadges.length > 0;
  const showXp = data.wasCountedAsNewCompletion && data.xpEarned > 0;

  const xpRequired = xpRequiredToAdvanceFromLevel(data.levelAfter);
  const xpToNext = data.xpToNextLevel ?? xpRequired;
  const xpIntoLevel = Math.max(0, xpRequired - xpToNext);
  const totalXp = cumulativeXpForLevel(data.levelAfter) + xpIntoLevel;
  const progressPercent = xpRequired > 0 ? Math.min(100, (xpIntoLevel / xpRequired) * 100) : 0;

  const [animatedPercent, setAnimatedPercent] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setAnimatedPercent(progressPercent));
    });
    return () => cancelAnimationFrame(id);
  }, [progressPercent]);

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
                className="relative h-full rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] dark:from-amber-500 dark:via-amber-400 dark:to-yellow-500"
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
              +{data.xpEarned} XP
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span>Level {data.levelAfter}</span>
            {data.xpToNextLevel != null && data.xpToNextLevel > 0 && (
              <span>{data.xpToNextLevel} to next level</span>
            )}
          </div>

          {leveledUp && (
            <p className="mt-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
              Level up! Now level {data.levelAfter}
            </p>
          )}
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
