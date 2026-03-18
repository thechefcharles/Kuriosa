"use client";

import Link from "next/link";
import { CheckCircle2, Sparkles, XCircle } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { Button, buttonVariants } from "@/components/ui/button";
import type { ChallengeValidationResult } from "@/lib/services/challenge/validate-challenge-answer";
import { cn } from "@/lib/utils";

export function ChallengeFeedback({
  slug,
  result,
  onRetry,
}: {
  slug: string;
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
        <Link
          href={`${ROUTES.curiosity(slug)}#whats-next`}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex min-h-12 w-full items-center justify-center gap-2 sm:w-auto"
          )}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Continue
        </Link>
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Follow-ups and trails are coming next — for now, revisit the lesson or explore more.
      </p>
    </div>
  );
}
