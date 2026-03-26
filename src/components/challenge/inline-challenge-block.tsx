"use client";

import { useCallback, useId, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRecordCuriosityCompletion } from "@/hooks/mutations/useRecordCuriosityCompletion";
import { getTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { getModeUsedLabel } from "@/lib/services/progress/session-curiosity-modes";
import { incrementSessionCompletions } from "@/lib/progress/session-completion-tracker";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import type { ProgressUpdateSuccess } from "@/types/progress";
import { ChallengeCard } from "@/components/challenge/challenge-card";
import { ChallengeOptionList } from "@/components/challenge/challenge-option-list";
import { ChallengeFeedback } from "@/components/challenge/challenge-feedback";
import { QuizSuccessCelebration } from "@/components/curiosity/quiz-success-celebration";
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
  /** Called when user finishes and claims XP (celebrates, then may navigate) */
  onComplete?: () => void;
  className?: string;
}) {
  const formId = useId();
  const challenge = experience.challenge;
  const lessonText = experience.lesson?.lessonText ?? "";

  const [completionPayload, setCompletionPayload] = useState<ProgressUpdateSuccess | null>(null);
  const recall = challenge ? isMemoryRecallChallenge(challenge) : false;

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [recallText, setRecallText] = useState("");
  const [result, setResult] = useState<ChallengeValidationResult | null>(null);
  const [hasRetried, setHasRetried] = useState(false);

  const canSubmit = useMemo(() => {
    if (!challenge) return false;
    if (recall) return recallText.trim().length > 0;
    return selectedIndex !== null;
  }, [challenge, recall, recallText, selectedIndex]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!challenge) return;
      if (recall) {
        setResult(
          validateChallengeAnswer(challenge, {
            kind: "recall",
            text: recallText,
          })
        );
        return;
      }
      if (selectedIndex === null) return;
      setResult(
        validateChallengeAnswer(challenge, {
          kind: "choice",
          selectedIndex,
        })
      );
    },
    [challenge, recall, recallText, selectedIndex]
  );

  const handleRetry = useCallback(() => {
    setHasRetried(true);
    setResult(null);
    setSelectedIndex(null);
    setRecallText("");
  }, []);

  if (!challenge) return null;
  if (!recall && challenge.options.length === 0) return null;

  if (completionPayload) {
    return (
      <QuizSuccessCelebration
        data={completionPayload}
        currentSlug={slug}
        onComplete={onComplete}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      <form id={formId} onSubmit={handleSubmit}>
        <ChallengeCard challenge={challenge!}>
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
              options={challenge!.options}
              selectedIndex={selectedIndex}
              onSelect={setSelectedIndex}
              disabled={result !== null}
              name={`challenge-${challenge!.id}`}
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

      {result ? (
        <ChallengeFeedback
          slug={slug}
          topicId={experience.identity.id}
          result={result}
          onRetry={handleRetry}
          lessonText={lessonText}
          inlineContinue={
            <InlineChallengeContinueButton
              slug={slug}
              topicId={experience.identity.id}
              challengeCorrect={result.isCorrect}
              onComplete={onComplete}
              onPayload={setCompletionPayload}
            />
          }
        />
      ) : null}
    </div>
  );
}

/**
 * Inline "Claim XP" button: records completion, then shows inline celebration
 * (confetti, XP, progress, badges) with Discover / Next curiosity options.
 */
function InlineChallengeContinueButton({
  slug,
  topicId,
  challengeCorrect,
  onComplete,
  onPayload,
}: {
  slug: string;
  topicId: string;
  challengeCorrect: boolean;
  onComplete?: () => void;
  /** Called with API response to show inline celebration */
  onPayload?: (data: ProgressUpdateSuccess) => void;
}) {
  const { mutateAsync } = useRecordCuriosityCompletion();
  const [isPending, setIsPending] = useState(false);
  const [syncMissed, setSyncMissed] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  const handleClick = async () => {
    setSyncMissed(false);
    setSyncError(null);
    setIsPending(true);
    try {
      const { wasDailyFeature, wasRandomSpin } = getTopicDiscoveryContext(slug);
      const res = await mutateAsync({
        topicId,
        slug,
        modeUsed: getModeUsedLabel(slug),
        challengeCorrect,
        wasDailyFeature,
        wasRandomSpin,
      });
      if (res.ok) {
        const d = res.data;
        if (d.wasCountedAsNewCompletion) {
          incrementSessionCompletions();
        }
        onPayload?.(d);
        onComplete?.();
      } else {
        setSyncMissed(true);
        setSyncError(res.message);
      }
    } catch (err) {
      setSyncMissed(true);
      const detail =
        err instanceof Error ? err.message : "Network or server error.";
      setSyncError(
        `${detail} If this is the app, confirm NEXT_PUBLIC_API_ORIGIN is your Vercel URL, redeploy this commit, then rebuild build:export.`
      );
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
        className={cn(
          "inline-flex min-h-12 w-full items-center justify-center gap-2 sm:w-auto",
          !isPending && "btn-jackpot"
        )}
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
          <>Claim your XP</>
        )}
      </Button>
      {syncMissed ? (
        <p className="mt-1 text-xs text-muted-foreground" role="status">
          Couldn&apos;t save — you can still explore below.
          {syncError ? (
            <span className="mt-1 block text-[11px] opacity-90">{syncError}</span>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}
