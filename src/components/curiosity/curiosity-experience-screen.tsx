"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCuriosityExperience } from "@/hooks/queries/useCuriosityExperience";
import { useCompletedTopicIds } from "@/hooks/queries/useCompletedTopicIds";
import { CuriosityHeader } from "@/components/curiosity/curiosity-header";
import { LessonContent } from "@/components/curiosity/lesson-content";
import { AudioPlayer } from "@/components/curiosity/audio-player";
import { NextStepCallout } from "@/components/curiosity/next-step-callout";
import { InlineChallengeBlock } from "@/components/challenge/inline-challenge-block";
import { PostChallengeExploration } from "@/components/curiosity/post-challenge-exploration";
import { ShareTopicButton } from "@/components/social/share-topic-button";
import { CompletionCelebrationHost } from "@/components/curiosity/completion-celebration-host";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { cn } from "@/lib/utils";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { isAudioAvailable } from "@/lib/audio/is-audio-available";
import { initCuriosityModesSession } from "@/lib/services/progress/session-curiosity-modes";

const DIFFICULTY_CARD_STYLES: Record<string, string> = {
  beginner:
    "border-emerald-400 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/80",
  easy:
    "border-emerald-400 bg-emerald-100 dark:border-emerald-600 dark:bg-emerald-900/80",
  intermediate:
    "border-amber-400 bg-amber-100 dark:border-amber-600 dark:bg-amber-900/80",
  advanced:
    "border-rose-400 bg-rose-100 dark:border-rose-600 dark:bg-rose-900/80",
  expert:
    "border-rose-400 bg-rose-100 dark:border-rose-600 dark:bg-rose-900/80",
};

const DEFAULT_CARD =
  "border-slate-200/90 bg-white/90 dark:border-white/10 dark:bg-slate-900/60";

const DIFFICULTY_TEXT_STYLES: Record<string, string> = {
  beginner: "text-emerald-900 dark:text-emerald-100",
  easy: "text-emerald-900 dark:text-emerald-100",
  intermediate: "text-amber-900 dark:text-amber-100",
  advanced: "text-rose-900 dark:text-rose-100",
  expert: "text-rose-900 dark:text-rose-100",
};

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

export function CuriosityExperienceScreen({ slug }: { slug: string }) {
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
      />
    );
  }, [data, error, hasAudio, isError, isLoading, slug]);

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
}: {
  experience: LoadedCuriosityExperience;
  hasAudio: boolean;
  slug: string;
}) {
  const { isCompleted } = useCompletedTopicIds();
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

  const diff = (experience.taxonomy.difficultyLevel ?? "").trim().toLowerCase();
  const cardStyle = DIFFICULTY_CARD_STYLES[diff] ?? DEFAULT_CARD;
  const textStyle = DIFFICULTY_TEXT_STYLES[diff] ?? DEFAULT_TEXT;

  return (
    <>
      {/* Share button fixed top right */}
      <div className="fixed right-4 top-14 z-20">
        <ShareTopicButton
          topicId={experience.identity.id}
          slug={slug}
          title={experience.identity.title}
          hookQuestion={experience.discoveryCard.hookQuestion}
          shortSummary={experience.discoveryCard.shortSummary}
          variant="outline"
          size="default"
          className="shadow-md"
        />
      </div>

      <article
        className={cn(
          "overflow-hidden rounded-xl border shadow-lg",
          cardStyle
        )}
      >
        <CuriosityHeader experience={experience} />

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
                />
              )}
            </>
          )}

          <section id="whats-next" className="scroll-mt-24 space-y-6">
            <CompletionCelebrationHost
              key={completionCheckKey}
              topicSlug={slug}
              onConsumed={handleConsumed}
            />
            <PostChallengeExploration
              experience={experience}
              hasCompletedChallenge={hasCompletedChallenge}
            />
          </section>
        </div>
      </article>
    </>
  );
}

