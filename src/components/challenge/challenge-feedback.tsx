"use client";

import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChallengeValidationResult } from "@/lib/services/challenge/validate-challenge-answer";
import { ChallengeContinueExploringButton } from "@/components/challenge/challenge-continue-exploring-button";
import { cn } from "@/lib/utils";

export function ChallengeFeedback({
  slug,
  topicId,
  result,
  onRetry,
}: {
  slug: string;
  topicId: string;
  result: ChallengeValidationResult;
  onRetry: () => void;
}) {
  const ok = result.isCorrect;

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
            {ok ? "Nice — that’s right!" : "Not quite — here’s the idea."}
          </p>
          {!ok && result.correctAnswerDisplay && result.correctAnswerDisplay !== "—" ? (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Answer: </span>
              {result.correctAnswerDisplay}
            </p>
          ) : null}
          {result.explanation ? (
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
              {result.explanation}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-h-12 w-full sm:w-auto"
          onClick={onRetry}
        >
          Try again
        </Button>
        <ChallengeContinueExploringButton
          slug={slug}
          topicId={topicId}
          challengeCorrect={ok}
        />
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Saves your visit (no XP yet) and scrolls to <strong>What&apos;s next</strong> — follow-ups
        and next curiosities on the lesson page.
      </p>
    </div>
  );
}
