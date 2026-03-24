"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCuriosityExperience } from "@/hooks/queries/useCuriosityExperience";
import { useCompletedTopicIds } from "@/hooks/queries/useCompletedTopicIds";
import { CuriosityHeader } from "@/components/curiosity/curiosity-header";
import { LessonContent } from "@/components/curiosity/lesson-content";
import { AudioPlayer } from "@/components/curiosity/audio-player";
import { NextStepCallout } from "@/components/curiosity/next-step-callout";
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
  const hasCompletedChallenge =
    isCompleted(experience.identity.id) || hasJustCompleted;
  const handleConsumed = useCallback(() => setHasJustCompleted(true), []);

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

  return (
    <article className="space-y-5">
      <CuriosityHeader experience={experience} />

      <div className="flex flex-wrap items-center gap-2">
        <ShareTopicButton
          topicId={experience.identity.id}
          slug={slug}
          title={experience.identity.title}
          hookQuestion={experience.discoveryCard.hookQuestion}
          shortSummary={experience.discoveryCard.shortSummary}
          variant="default"
          size="default"
        />
      </div>

      <LessonContent
        experience={experience}
        playButtonSlot={playButtonSlot}
      />

      {!hasCompletedChallenge && (
        <NextStepCallout slug={experience.identity.slug} experience={experience} />
      )}

      <section id="whats-next" className="scroll-mt-24 space-y-6">
        <CompletionCelebrationHost
          topicSlug={slug}
          onConsumed={handleConsumed}
        />
        <PostChallengeExploration
          experience={experience}
          hasCompletedChallenge={hasCompletedChallenge}
        />
      </section>
    </article>
  );
}

