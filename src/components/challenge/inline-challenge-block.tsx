"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRecordCuriosityCompletion } from "@/hooks/mutations/useRecordCuriosityCompletion";
import { getTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { getModeUsedLabel } from "@/lib/services/progress/session-curiosity-modes";
import { stashCompletionCelebration } from "@/lib/progress/completion-celebration-storage";
import { incrementSessionCompletions } from "@/lib/progress/session-completion-tracker";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { ChallengeCard } from "@/components/challenge/challenge-card";
import { ChallengeOptionList } from "@/components/challenge/challenge-option-list";
import { ChallengeFeedback } from "@/components/challenge/challenge-feedback";
import { ChallengeBonusOffer } from "@/components/challenge/challenge-bonus-offer";
import {
  isMemoryRecallChallenge,
  validateChallengeAnswer,
  type ChallengeValidationResult,
} from "@/lib/services/challenge/validate-challenge-answer";
import { cn } from "@/lib/utils";

/**
 * Inline quiz embedded below the curiosity card. Reuses challenge UI from
 * ChallengeScreen but stays on the curiosity page.
 */
export function InlineChallengeBlock({
  experience,
  slug,
  onComplete,
  className,
}: {
  experience: LoadedCuriosityExperience;
  slug: string;
  /** Called when user finishes and clicks "See what's next" */
  onComplete?: () => void;
  className?: string;
}) {
  const formId = useId();
  const challenge = experience.challenge;
  const bonusChallenge = experience.bonusChallenge;
  const lessonText = experience.lesson?.lessonText ?? "";

  const [currentQuestion, setCurrentQuestion] = useState<0 | 1>(0);
  const activeChallenge =
    currentQuestion === 0 ? challenge : bonusChallenge ?? challenge;
  const isBonus = currentQuestion === 1;
  const recall = activeChallenge ? isMemoryRecallChallenge(activeChallenge) : false;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [recallText, setRecallText] = useState("");
  const [result, setResult] = useState<ChallengeValidationResult | null>(null);
  const [hasRetried, setHasRetried] = useState(false);

  const canSubmit = useMemo(() => {
    if (!activeChallenge) return false;
    if (recall) return recallText.trim().length > 0;
    return selectedIndex !== null;
  }, [activeChallenge, recall, recallText, selectedIndex]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!activeChallenge) return;
      if (recall) {
        setResult(
          validateChallengeAnswer(activeChallenge, {
            kind: "recall",
            text: recallText,
          })
        );
        return;
      }
      if (selectedIndex === null) return;
      setResult(
        validateChallengeAnswer(activeChallenge, {
          kind: "choice",
          selectedIndex,
        })
      );
    },
    [activeChallenge, recall, recallText, selectedIndex]
  );

  const handleRetry = useCallback(() => {
    setHasRetried(true);
    setResult(null);
    setSelectedIndex(null);
    setRecallText("");
  }, []);

  const handleTryBonus = useCallback(() => {
    setCurrentQuestion(1);
    setResult(null);
    setSelectedIndex(null);
    setRecallText("");
  }, []);

  const showBonusOffer =
    currentQuestion === 0 &&
    result?.isCorrect === true &&
    bonusChallenge != null;

  if (!challenge) return null;
  if (!recall && challenge.options.length === 0) return null;

  return (
    <div className={cn("space-y-6", className)}>
      <form id={formId} onSubmit={handleSubmit}>
        <ChallengeCard challenge={activeChallenge!}>
          {recall ? (
            <label className="block">
              <span className="sr-only">Your answer</span>
              <textarea
                value={recallText}
                onChange={(e) => setRecallText(e.target.value)}
                disabled={result !== null}
                rows={4}
                placeholder="Type your answer…"
                className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] leading-relaxed text-foreground placeholder:text-muted-foreground focus-visible:border-kuriosa-deep-purple focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kuriosa-deep-purple/20 dark:border-white/15 dark:bg-slate-950/40 dark:focus-visible:border-kuriosa-electric-cyan dark:focus-visible:ring-kuriosa-electric-cyan/20"
              />
            </label>
          ) : (
            <ChallengeOptionList
              options={activeChallenge!.options}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              disabled={result !== null}
              name={`challenge-${activeChallenge!.id}`}
            />
          )}

          {result === null ? (
            <div className="mt-6">
              <Button
                type="submit"
                size="lg"
                disabled={!canSubmit}
                className="h-12 min-h-[48px] w-full bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-50 dark:bg-emerald-600 dark:hover:bg-emerald-500 sm:w-auto"
              >
                Check answer
              </Button>
            </div>
          ) : null}
        </ChallengeCard>
      </form>

      {result && currentQuestion === 0 ? (
        <ChallengeFeedback
          slug={slug}
          topicId={experience.identity.id}
          result={result}
          onRetry={handleRetry}
          lessonText={lessonText}
          showBonusOffer={showBonusOffer}
          firstTryCorrect={result.isCorrect && !hasRetried}
          onContinueSlot={
            showBonusOffer ? (
              <ChallengeBonusOffer
                onTryBonus={handleTryBonus}
                onContinue={
                  <InlineChallengeContinueButton
                    slug={slug}
                    topicId={experience.identity.id}
                    challengeCorrect={true}
                    firstTryCorrect={result.isCorrect && !hasRetried}
                    onComplete={onComplete}
                  />
                }
              />
            ) : undefined
          }
          inlineContinue={
            !showBonusOffer
              ? (
                <InlineChallengeContinueButton
                  slug={slug}
                  topicId={experience.identity.id}
                  challengeCorrect={result.isCorrect}
                  firstTryCorrect={result.isCorrect && !hasRetried}
                  onComplete={onComplete}
                />
                )
              : undefined
          }
        />
      ) : null}

      {result && currentQuestion === 1 ? (
        <ChallengeFeedback
          slug={slug}
          topicId={experience.identity.id}
          result={result}
          onRetry={handleRetry}
          lessonText={lessonText}
          bonusCorrect={result.isCorrect}
          firstTryCorrect={false}
          inlineContinue={
            <InlineChallengeContinueButton
              slug={slug}
              topicId={experience.identity.id}
              challengeCorrect={true}
              bonusCorrect={result.isCorrect}
              firstTryCorrect={false}
              onComplete={onComplete}
            />
          }
        />
      ) : null}
    </div>
  );
}

/**
 * Same as ChallengeContinueExploringButton but for inline use: records completion,
 * stashes celebration, then calls onComplete + scrolls instead of navigating.
 */
function InlineChallengeContinueButton({
  slug,
  topicId,
  challengeCorrect,
  bonusCorrect,
  firstTryCorrect = false,
  onComplete,
}: {
  slug: string;
  topicId: string;
  challengeCorrect: boolean;
  bonusCorrect?: boolean;
  firstTryCorrect?: boolean;
  onComplete?: () => void;
}) {
  const { mutateAsync } = useRecordCuriosityCompletion();
  const [isPending, setIsPending] = useState(false);
  const [syncMissed, setSyncMissed] = useState(false);

  const handleClick = async () => {
    setSyncMissed(false);
    setIsPending(true);
    try {
      const { wasDailyFeature, wasRandomSpin } = getTopicDiscoveryContext(slug);
      const res = await mutateAsync({
        topicId,
        slug,
        modeUsed: getModeUsedLabel(slug),
        challengeCorrect,
        bonusCorrect,
        firstTryCorrect,
        wasDailyFeature,
        wasRandomSpin,
      });
      if (res.ok) {
        const d = res.data;
        const worthCelebrating =
          d.wasCountedAsNewCompletion ||
          (d.unlockedBadges?.length ?? 0) > 0;
        if (worthCelebrating && d.wasCountedAsNewCompletion) {
          incrementSessionCompletions();
        }
        if (worthCelebrating) {
          stashCompletionCelebration({
            topicSlug: slug,
            xpEarned: d.xpEarned,
            wasCountedAsNewCompletion: d.wasCountedAsNewCompletion,
            levelBefore: d.levelBefore,
            levelAfter: d.levelAfter,
            xpToNextLevel: d.xpToNextLevel,
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
        onComplete?.();
        document.getElementById("whats-next")?.scrollIntoView({ behavior: "smooth" });
      } else {
        setSyncMissed(true);
      }
    } catch {
      setSyncMissed(true);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <Button
        type="button"
        size="lg"
        disabled={isPending}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 sm:w-auto"
        onClick={() => void handleClick()}
      >
        {isPending ? (
          <span className="inline-flex gap-2">
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
        <p className="mt-1 text-xs text-muted-foreground" role="status">
          Couldn&apos;t save — you can still explore below.
        </p>
      ) : null}
    </div>
  );
}
