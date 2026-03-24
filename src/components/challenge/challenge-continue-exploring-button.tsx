"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { useRecordCuriosityCompletion } from "@/hooks/mutations/useRecordCuriosityCompletion";
import { getTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { getModeUsedLabel } from "@/lib/services/progress/session-curiosity-modes";
import { cn } from "@/lib/utils";
import { stashCompletionCelebration } from "@/lib/progress/completion-celebration-storage";
import { incrementSessionCompletions } from "@/lib/progress/session-completion-tracker";

/**
 * Records completion when the user leaves the challenge for post-challenge exploration.
 * See PHASE_5_CORE_UX_INVENTORY.md — completion trigger.
 */
export function ChallengeContinueExploringButton({
  slug,
  topicId,
  challengeCorrect,
  bonusCorrect,
}: {
  slug: string;
  topicId: string;
  challengeCorrect: boolean;
  /** True when user attempted bonus question and got it right. */
  bonusCorrect?: boolean;
}) {
  const router = useRouter();
  const { mutateAsync, isPending } = useRecordCuriosityCompletion();
  const [syncMissed, setSyncMissed] = useState(false);

  const handleClick = async () => {
    setSyncMissed(false);
    try {
      const { wasDailyFeature, wasRandomSpin } = getTopicDiscoveryContext(slug);
      const res = await mutateAsync({
        topicId,
        slug,
        modeUsed: getModeUsedLabel(slug),
        challengeCorrect,
        bonusCorrect,
        wasDailyFeature,
        wasRandomSpin,
      });
      if (res.ok) {
        const d = res.data;
        const worthCelebrating =
          d.wasCountedAsNewCompletion ||
          (d.unlockedBadges?.length ?? 0) > 0;
        if (worthCelebrating) {
          if (d.wasCountedAsNewCompletion) {
            incrementSessionCompletions();
          }
          stashCompletionCelebration({
            topicSlug: slug,
            xpEarned: d.xpEarned,
            wasCountedAsNewCompletion: d.wasCountedAsNewCompletion,
            levelBefore: d.levelBefore,
            levelAfter: d.levelAfter,
            streakBefore: d.streakBefore,
            streakAfter: d.streakAfter,
            curiosityScoreBefore: d.curiosityScoreBefore,
            curiosityScoreAfter: d.curiosityScoreAfter,
            breakdown: d.breakdown ?? null,
            unlockedBadges: (d.unlockedBadges ?? []).map((b) => ({
              slug: b.slug,
              name: b.name,
              description: b.description,
            })),
          });
        }
      } else {
        setSyncMissed(true);
      }
    } catch {
      setSyncMissed(true);
    } finally {
      router.push(`${ROUTES.curiosity(slug)}#whats-next`);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <Button
        type="button"
        size="lg"
        disabled={isPending}
        className={cn(
          "inline-flex min-h-12 w-full items-center justify-center gap-2 sm:w-auto"
        )}
        onClick={() => void handleClick()}
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
            Saving…
          </span>
        ) : (
          <>
            <Sparkles className="h-4 w-4" aria-hidden />
            See what&apos;s next
          </>
        )}
      </Button>
      {syncMissed ? (
        <p className="mt-1 text-center text-xs text-muted-foreground sm:text-left" role="status">
          Couldn&apos;t save this time — you can still explore. Sign in and try again if you care
          about XP.
        </p>
      ) : null}
    </div>
  );
}
