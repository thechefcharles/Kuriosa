"use client";

import { useCallback, useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useCuriosityExperience } from "@/hooks/queries/useCuriosityExperience";
import { ROUTES } from "@/lib/constants/routes";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ChallengeTopicMissing } from "@/components/challenge/challenge-topic-missing";
import { ChallengeEmptyState } from "@/components/challenge/challenge-empty-state";
import { ChallengeCard } from "@/components/challenge/challenge-card";
import { ChallengeOptionList } from "@/components/challenge/challenge-option-list";
import { ChallengeFeedback } from "@/components/challenge/challenge-feedback";
import { ChallengeContinueExploringButton } from "@/components/challenge/challenge-continue-exploring-button";
import {
  isMemoryRecallChallenge,
  validateChallengeAnswer,
  type ChallengeValidationResult,
} from "@/lib/services/challenge/validate-challenge-answer";
import { cn } from "@/lib/utils";

export function ChallengeScreen({ slug }: { slug: string }) {
  const formId = useId();
  const { data, isLoading, isError, error } = useCuriosityExperience(slug);

  const challenge = data?.challenge;
  const lessonText = data?.lesson?.lessonText ?? "";

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
          validateChallengeAnswer(challenge, { kind: "recall", text: recallText })
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

  if (isLoading) {
    return (
      <div className="py-12">
        <LoadingState />
      </div>
    );
  }

  if (isError) {
    return <ErrorState message={error.message} />;
  }

  if (!data) {
    return <ChallengeTopicMissing />;
  }

  if (!challenge) {
    return <ChallengeEmptyState slug={slug} />;
  }

  if (!recall && challenge.options.length === 0) {
    return <ChallengeEmptyState slug={slug} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={ROUTES.curiosity(slug)}
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "inline-flex items-center gap-1.5 text-muted-foreground"
          )}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to lesson
        </Link>
      </div>

      <header>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Step 2 of 3 · {data.identity.title}
        </p>
        <h1 className="mt-1 text-2xl font-bold text-kuriosa-midnight-blue dark:text-slate-50">
          Quick challenge
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          One question — then claim your XP.
        </p>
      </header>

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
          topicId={data.identity.id}
          result={result}
          onRetry={handleRetry}
          lessonText={lessonText}
          firstTryCorrect={result.isCorrect && !hasRetried}
        />
      ) : null}
    </div>
  );
}
