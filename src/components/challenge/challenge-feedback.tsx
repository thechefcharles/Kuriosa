"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChallengeValidationResult } from "@/lib/services/challenge/validate-challenge-answer";
import { ChallengeContinueExploringButton } from "@/components/challenge/challenge-continue-exploring-button";
import { useRecordCuriosityCompletion } from "@/hooks/mutations/useRecordCuriosityCompletion";
import { getTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { getModeUsedLabel } from "@/lib/services/progress/session-curiosity-modes";
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

function lessonSnippet(lessonText: string, maxChars = 180): string {
  const cleaned = lessonText.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxChars) return cleaned;
  const cut = cleaned.slice(0, maxChars).trim();
  const lastSpace = cut.lastIndexOf(" ");
  return lastSpace > maxChars / 2 ? cut.slice(0, lastSpace) + "…" : cut + "…";
}

export function ChallengeFeedback({
  slug,
  topicId,
  result,
  onRetry,
  lessonText,
  inlineContinue,
}: {
  slug: string;
  topicId: string;
  result: ChallengeValidationResult;
  onRetry: () => void;
  /** When wrong, show "From the lesson" snippet to reinforce learning */
  lessonText?: string;
  /** When provided, use this instead of ChallengeContinueExploringButton (e.g. inline on curiosity page) */
  inlineContinue?: React.ReactNode;
}) {
  const ok = result.isCorrect;
  const confettiFired = useRef(false);
  const wrongRecorded = useRef(false);
  const { mutateAsync: recordCompletion } = useRecordCuriosityCompletion();

  useEffect(() => {
    if (ok && !confettiFired.current) {
      confettiFired.current = true;
      fireConfetti();
    }
  }, [ok]);

  useEffect(() => {
    if (!ok && !wrongRecorded.current && topicId && slug) {
      wrongRecorded.current = true;
      const { wasDailyFeature, wasRandomSpin } = getTopicDiscoveryContext(slug);
      void recordCompletion({
        topicId,
        slug,
        modeUsed: getModeUsedLabel(slug),
        challengeCorrect: false,
        wasDailyFeature,
        wasRandomSpin,
      });
    }
  }, [ok, topicId, slug, recordCompletion]);

  return (
    <div
      className={cn(
        "mt-6 rounded-2xl border p-5 sm:p-6",
        ok
          ? "border-emerald-300/60 bg-emerald-50/70 dark:border-emerald-900/40 dark:bg-emerald-950/25"
          : "border-amber-200/80 bg-amber-50/60 dark:border-amber-900/35 dark:bg-amber-950/20"
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        {ok ? (
          <CheckCircle2
            className="mt-0.5 h-8 w-8 shrink-0 text-emerald-600 dark:text-emerald-400"
            aria-hidden
          />
        ) : (
          <XCircle
            className="mt-0.5 h-8 w-8 shrink-0 text-amber-600 dark:text-amber-400"
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <p className="text-base font-semibold text-foreground">
            {ok ? "Correct!" : "Not quite — here's the idea."}
          </p>
          {!ok && result.correctAnswerDisplay && result.correctAnswerDisplay !== "—" ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Answer: </span>
              {result.correctAnswerDisplay}
            </p>
          ) : null}
          {!ok && result.explanation ? (
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {result.explanation}
            </p>
          ) : null}
          {!ok && lessonText?.trim() ? (
            <div className="mt-3 rounded-lg border border-slate-200/80 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-slate-900/40">
              <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <BookOpen className="h-3.5 w-3.5" aria-hidden />
                From the lesson:
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                {lessonSnippet(lessonText)}
              </p>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        {!ok ? (
          <Button
            type="button"
            size="lg"
            className="min-h-12 w-full sm:w-auto"
            onClick={onRetry}
          >
            Try again
          </Button>
        ) : (
          inlineContinue ?? (
            <ChallengeContinueExploringButton
              slug={slug}
              topicId={topicId}
              challengeCorrect={ok}
              jackpot={ok}
            />
          )
        )}
      </div>

    </div>
  );
}
