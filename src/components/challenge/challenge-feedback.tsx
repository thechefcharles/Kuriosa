"use client";

import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChallengeValidationResult } from "@/lib/services/challenge/validate-challenge-answer";
import { ChallengeContinueExploringButton } from "@/components/challenge/challenge-continue-exploring-button";
import { cn } from "@/lib/utils";

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
  showBonusOffer,
  bonusCorrect,
  firstTryCorrect = false,
  onContinueSlot,
}: {
  slug: string;
  topicId: string;
  result: ChallengeValidationResult;
  onRetry: () => void;
  /** When wrong, show "From the lesson" snippet to reinforce learning */
  lessonText?: string;
  /** When true, parent renders bonus offer; we omit our action buttons */
  showBonusOffer?: boolean;
  /** When showing post-bonus feedback, pass bonus result for completion */
  bonusCorrect?: boolean;
  /** True when main challenge correct on first try (no retry) */
  firstTryCorrect?: boolean;
  /** Slot for Continue button when showBonusOffer (parent renders it) */
  onContinueSlot?: React.ReactNode;
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
            {ok ? "Nice — you've got it." : "Not quite — here's the idea."}
          </p>
          {ok && bonusCorrect ? (
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              Bonus complete — +10 XP
            </p>
          ) : ok && !bonusCorrect ? (
            <p className="text-xs text-muted-foreground">
              Earn XP when you see what&apos;s next
            </p>
          ) : null}
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

      {!showBonusOffer ? (
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
          ) : null}
          <ChallengeContinueExploringButton
            slug={slug}
            topicId={topicId}
            challengeCorrect={ok}
            bonusCorrect={bonusCorrect}
            firstTryCorrect={firstTryCorrect}
          />
        </div>
      ) : null}

      {onContinueSlot ? (
        <div className="mt-6">{onContinueSlot}</div>
      ) : null}

      {!showBonusOffer && !onContinueSlot ? (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Takes you back to your next paths.
        </p>
      ) : null}
    </div>
  );
}
