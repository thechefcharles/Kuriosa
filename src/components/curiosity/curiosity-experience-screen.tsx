"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useCuriosityExperience } from "@/hooks/queries/useCuriosityExperience";
import { useCompletedTopicIds } from "@/hooks/queries/useCompletedTopicIds";
import { useTopicCompletionDetails } from "@/hooks/queries/useTopicCompletionDetails";
import { useFeedRandomCuriosity, writeLastRandomSlug } from "@/hooks/mutations/useFeedRandomCuriosity";
import { CuriosityHeader } from "@/components/curiosity/curiosity-header";
import { LessonContent } from "@/components/curiosity/lesson-content";
import { AudioPlayer } from "@/components/curiosity/audio-player";
import { NextStepCallout } from "@/components/curiosity/next-step-callout";
import { InlineChallengeBlock } from "@/components/challenge/inline-challenge-block";
import { CompletionCelebrationHost } from "@/components/curiosity/completion-celebration-host";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { isAudioAvailable } from "@/lib/audio/is-audio-available";
import { initCuriosityModesSession } from "@/lib/services/progress/session-curiosity-modes";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CheckCircle2, XCircle } from "lucide-react";
import { CARD_BASE } from "@/lib/constants/card-styles";
import { getCardXpFromDifficulty } from "@/lib/progress/xp-config";
import { ROUTES } from "@/lib/constants/routes";

const DEFAULT_TEXT = "text-kuriosa-midnight-blue dark:text-slate-200";

function CuriosityEmpty() {
  return (
    <EmptyState
      title="Curiosity not found"
      description="This topic may have been removed or isn’t available yet."
      icon={null}
      className="rounded-2xl border border-dashed border-violet-300/60 bg-white/80 px-6 py-10 dark:border-white/15 dark:bg-slate-950/40"
    />
  );
}

export function CuriosityExperienceScreen({
  slug,
  fromDiscover = false,
}: {
  slug: string;
  fromDiscover?: boolean;
}) {
  const { data, isLoading, isError, error } = useCuriosityExperience(slug);

  const hasAudio = data ? isAudioAvailable(data.audio) : false;

  const ui = useMemo(() => {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={error.message} />;
    if (!data) return <CuriosityEmpty />;
    return (
      <ExperienceView
        experience={data}
        hasAudio={hasAudio}
        slug={slug}
        fromDiscover={fromDiscover}
      />
    );
  }, [data, error, hasAudio, isError, isLoading, slug, fromDiscover]);

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/90 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="pb-10 pt-6 sm:pt-8">{ui}</PageContainer>
    </div>
  );
}

function ExperienceView({
  experience,
  hasAudio,
  slug,
  fromDiscover,
}: {
  experience: LoadedCuriosityExperience;
  hasAudio: boolean;
  slug: string;
  fromDiscover: boolean;
}) {
  const router = useRouter();
  const randomMutation = useFeedRandomCuriosity();

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleSkip = useCallback(() => {
    randomMutation.mutate(
      { excludeSlug: slug },
      {
        onSuccess: (data) => {
          if (data?.identity.slug) {
            writeLastRandomSlug(data.identity.slug);
            router.push(`${ROUTES.curiosity(data.identity.slug)}?from=discover`);
          }
        },
      }
    );
  }, [slug, router, randomMutation]);

  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const SWIPE_THRESHOLD = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0;
    touchEndX.current = touchStartX.current;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0]?.clientX ?? 0;
  }, []);

  const onTouchEnd = useCallback(() => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) handleSkip();
      else handleBack();
    }
  }, [handleSkip, handleBack]);

  const { isCompleted } = useCompletedTopicIds();
  const { data: completionDetails } = useTopicCompletionDetails(experience.identity.id);
  const [hasJustCompleted, setHasJustCompleted] = useState(false);
  const [showInlineChallenge, setShowInlineChallenge] = useState(false);
  const [completionCheckKey, setCompletionCheckKey] = useState(0);
  const hasCompletedChallenge =
    isCompleted(experience.identity.id) || hasJustCompleted;

  const handleConsumed = useCallback(() => setHasJustCompleted(true), []);

  const handleChallengeComplete = useCallback(() => {
    setHasJustCompleted(true);
    setCompletionCheckKey((k) => k + 1);
  }, []);

  useEffect(() => {
    initCuriosityModesSession(slug);
  }, [slug]);

  const playButtonSlot =
    hasAudio && experience.audio ? (
      <AudioPlayer
        key={experience.identity.slug}
        src={experience.audio.audioUrl}
        title={experience.identity.title}
        compact
      />
    ) : undefined;

  const textStyle = DEFAULT_TEXT;

  return (
    <>
      {/* Discover nav: arrows on sides of card, vertically centered */}
      {fromDiscover && (
        <>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleBack}
            aria-label="Go back"
            className="fixed left-4 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full bg-white/95 shadow-md dark:bg-slate-900/95"
          >
            <ChevronLeft className="h-6 w-6 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleSkip}
            disabled={randomMutation.isPending}
            aria-label="Skip to next random topic"
            className="fixed right-4 top-1/2 z-20 h-11 w-11 -translate-y-1/2 rounded-full bg-white/95 shadow-md dark:bg-slate-900/95"
          >
            <ChevronRight className="h-6 w-6 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
          </Button>
        </>
      )}

      <article
        className={cn(
          "overflow-hidden rounded-xl shadow-lg",
          CARD_BASE,
          fromDiscover && "touch-pan-y"
        )}
        onTouchStart={fromDiscover ? onTouchStart : undefined}
        onTouchMove={fromDiscover ? onTouchMove : undefined}
        onTouchEnd={fromDiscover ? onTouchEnd : undefined}
      >
        <CuriosityHeader
          experience={experience}
          completedState={
            completionDetails
              ? {
                  correct: completionDetails.xpEarned !== 5,
                  xpEarned: completionDetails.xpEarned,
                }
              : undefined
          }
        />

        <div className="space-y-6 p-5 sm:p-6">
          {showInlineChallenge && experience.challenge ? (
            <InlineChallengeBlock
              experience={experience}
              slug={slug}
              onComplete={handleChallengeComplete}
            />
          ) : (
            <>
              <LessonContent
                experience={experience}
                playButtonSlot={playButtonSlot}
                textClassName={textStyle}
              />

              {!hasCompletedChallenge && experience.challenge && (
                <NextStepCallout
                  slug={experience.identity.slug}
                  experience={experience}
                  onClick={() => setShowInlineChallenge(true)}
                  xpDisplay={getCardXpFromDifficulty(experience.taxonomy.difficultyLevel)}
                />
              )}

              {hasCompletedChallenge && (
                <section className="mt-8" aria-label="Challenge complete">
                  <div className="flex flex-col items-center justify-center gap-3 py-6">
                    <span className="text-lg font-semibold uppercase tracking-wide">
                      Complete
                    </span>
                    {completionDetails?.xpEarned === 5 ? (
                      <XCircle className="h-16 w-16 text-red-500" aria-hidden />
                    ) : (
                      <CheckCircle2 className="h-16 w-16 text-emerald-500" aria-hidden />
                    )}
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <Link
                      href={ROUTES.curiosity(slug)}
                      className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
                    >
                      Review
                    </Link>
                    {completionDetails?.xpEarned != null && (
                      <span
                        className={cn(
                          "shrink-0 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white",
                          completionDetails.xpEarned === 5 ? "xp-badge-wrong" : "xp-badge-correct"
                        )}
                      >
                        +{completionDetails.xpEarned} XP
                      </span>
                    )}
                  </div>
                </section>
              )}
            </>
          )}

          <section id="whats-next" className="scroll-mt-24 space-y-6">
            <CompletionCelebrationHost
              key={completionCheckKey}
              topicSlug={slug}
              onConsumed={handleConsumed}
            />
          </section>
        </div>
      </article>
    </>
  );
}

