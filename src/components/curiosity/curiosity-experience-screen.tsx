"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useCuriosityExperience } from "@/hooks/queries/useCuriosityExperience";
import { useCompletedTopicIds } from "@/hooks/queries/useCompletedTopicIds";
import type { CuriosityMode } from "@/components/curiosity/mode-toggle";
import { ModeToggle } from "@/components/curiosity/mode-toggle";
import { CuriosityHeader } from "@/components/curiosity/curiosity-header";
import { LessonContent } from "@/components/curiosity/lesson-content";
import { AudioPanel } from "@/components/curiosity/audio-panel";
import { NextStepCallout } from "@/components/curiosity/next-step-callout";
import { PostChallengeExploration } from "@/components/curiosity/post-challenge-exploration";
import { ShareTopicButton } from "@/components/social/share-topic-button";
import { ShareTopicCard } from "@/components/social/share-topic-card";
import { CompletionCelebrationHost } from "@/components/curiosity/completion-celebration-host";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { PageContainer } from "@/components/shared/page-container";
import { cn } from "@/lib/utils";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { isAudioAvailable } from "@/lib/audio/is-audio-available";
import {
  initCuriosityModesSession,
  markListenModeUsed,
} from "@/lib/services/progress/session-curiosity-modes";

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
  const [mode, setMode] = useState<CuriosityMode>("read");

  const { data, isLoading, isError, error } = useCuriosityExperience(slug);

  const hasAudio = data ? isAudioAvailable(data.audio) : false;

  const ui = useMemo(() => {
    if (isLoading) return <LoadingState />;
    if (isError) return <ErrorState message={error.message} />;
    if (!data) return <CuriosityEmpty />;
    return (
      <ExperienceView
        experience={data}
        mode={mode}
        setMode={setMode}
        hasAudio={hasAudio}
        slug={slug}
      />
    );
  }, [data, error, hasAudio, isError, isLoading, mode, slug]);

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
  mode,
  setMode,
  hasAudio,
  slug,
}: {
  experience: LoadedCuriosityExperience;
  mode: CuriosityMode;
  setMode: (next: CuriosityMode) => void;
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

  useEffect(() => {
    if (mode === "listen") markListenModeUsed(slug);
  }, [mode, slug]);

  useEffect(() => {
    if (!hasAudio && mode === "listen") setMode("read");
  }, [hasAudio, mode, setMode]);

  const [audioPlaybackFinished, setAudioPlaybackFinished] = useState(false);
  useEffect(() => {
    setAudioPlaybackFinished(false);
  }, [slug]);

  const onAudioPlaybackEnded = useCallback(() => setAudioPlaybackFinished(true), []);
  const onAudioPlaybackBegan = useCallback(() => setAudioPlaybackFinished(false), []);

  const listenMode = mode === "listen";

  return (
    <article className={cn("space-y-5", listenMode && "space-y-6")}>
      <CuriosityHeader experience={experience} compactHook={listenMode} />

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

      <ModeToggle
        mode={mode}
        onModeChange={setMode}
        hasAudio={hasAudio}
      />

      <AudioPanel
        experience={experience}
        audioMode={listenMode}
        audioPlaybackFinished={audioPlaybackFinished}
        onAudioPlaybackEnded={onAudioPlaybackEnded}
        onAudioPlaybackBegan={onAudioPlaybackBegan}
      />

      <LessonContent experience={experience} listenMode={listenMode} />

      <NextStepCallout slug={experience.identity.slug} />

      <section id="whats-next" className="scroll-mt-24 space-y-6">
        <CompletionCelebrationHost
          topicSlug={slug}
          onConsumed={handleConsumed}
        />
        <ShareTopicCard
          topicId={experience.identity.id}
          slug={slug}
          title={experience.identity.title}
          hookQuestion={experience.discoveryCard.hookQuestion}
          shortSummary={experience.discoveryCard.shortSummary}
        />
        <PostChallengeExploration
          experience={experience}
          hasCompletedChallenge={hasCompletedChallenge}
        />
      </section>
    </article>
  );
}

