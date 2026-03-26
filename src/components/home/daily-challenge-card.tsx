"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Zap } from "lucide-react";
import { CuriosityHeader } from "@/components/curiosity/curiosity-header";
import { LessonContent } from "@/components/curiosity/lesson-content";
import { AudioPlayer } from "@/components/curiosity/audio-player";
import { NextStepCallout } from "@/components/curiosity/next-step-callout";
import { InlineChallengeBlock } from "@/components/challenge/inline-challenge-block";
import { CompletionCelebrationHost } from "@/components/curiosity/completion-celebration-host";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CARD_BASE } from "@/lib/constants/card-styles";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { initCuriosityModesSession } from "@/lib/services/progress/session-curiosity-modes";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { isAudioAvailable } from "@/lib/audio/is-audio-available";
import { useCompletedTopicIds } from "@/hooks/queries/useCompletedTopicIds";
import { cn } from "@/lib/utils";
import { MOBILE_SAFE_ROUTES, ROUTES } from "@/lib/constants/routes";
import {
  XP_CONFIG,
  getCardXpFromDifficulty,
} from "@/lib/progress/xp-config";

const BOOST_REMINDER_KEY = "kuriosa-boost-reminder-shown";

function getBoostReminderShown(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const today = new Date().toDateString();
    return sessionStorage.getItem(`${BOOST_REMINDER_KEY}-${today}`) === "true";
  } catch {
    return false;
  }
}

function setBoostReminderShown(): void {
  if (typeof window === "undefined") return;
  try {
    const today = new Date().toDateString();
    sessionStorage.setItem(`${BOOST_REMINDER_KEY}-${today}`, "true");
  } catch {
    // ignore
  }
}

const DEFAULT_TEXT = "text-kuriosa-midnight-blue dark:text-slate-200";

export function DailyChallengeCard({
  experience,
  isCompleted: isCompletedFromData,
  challengeCorrect,
  xpEarned,
  dailyMultiplier = 1.5,
  boostRevealed = false,
  className,
}: {
  experience: LoadedCuriosityExperience;
  /** True when user has already completed this topic */
  isCompleted?: boolean;
  /** True when challenge was answered correctly */
  challengeCorrect?: boolean;
  /** XP earned when completed (5 when wrong, more when correct) */
  xpEarned?: number;
  /** Daily multiplier for today (1.2–2.5). Used for XP display when not completed. */
  dailyMultiplier?: number;
  /** True when user has spun to reveal today's boost (shows boosted XP and badge) */
  boostRevealed?: boolean;
  className?: string;
}) {
  const slug = experience.identity.slug;
  const { isCompleted } = useCompletedTopicIds();
  const [hasJustCompleted, setHasJustCompleted] = useState(false);
  const [showInlineChallenge, setShowInlineChallenge] = useState(false);
  const [completionCheckKey, setCompletionCheckKey] = useState(0);
  const [showBoostReminder, setShowBoostReminder] = useState(false);

  const hasCompletedChallenge =
    isCompletedFromData ?? (isCompleted(experience.identity.id) || hasJustCompleted);

  useEffect(() => {
    setTopicDiscoveryContext(slug, { wasDailyFeature: true, wasRandomSpin: false });
    initCuriosityModesSession(slug);
  }, [slug]);

  const handleChallengeComplete = useCallback(() => {
    setHasJustCompleted(true);
    setCompletionCheckKey((k) => k + 1);
  }, []);

  const handleConsumed = useCallback(() => setHasJustCompleted(true), []);

  const handleTakeQuizClick = useCallback(() => {
    if (!boostRevealed && !getBoostReminderShown()) {
      setBoostReminderShown();
      setShowBoostReminder(true);
      return;
    }
    setShowInlineChallenge(true);
  }, [boostRevealed]);

  const handleGoSpin = useCallback(() => {
    setShowBoostReminder(false);
    document.getElementById("daily-boost-spinner")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, []);

  const handleTakeQuizAnyway = useCallback(() => {
    setShowBoostReminder(false);
    setShowInlineChallenge(true);
  }, []);

  const hasAudio = isAudioAvailable(experience.audio);
  const playButtonSlot =
    hasAudio && experience.audio ? (
      <AudioPlayer
        key={experience.identity.slug}
        src={experience.audio.audioUrl}
        title={experience.identity.title}
        compact
      />
    ) : undefined;

  const isRetry = xpEarned === 5;
  const completedState =
    hasCompletedChallenge &&
    (challengeCorrect === true || challengeCorrect === false) &&
    xpEarned != null
      ? { correct: !isRetry, xpEarned }
      : undefined;

  const baseXp = Math.round(
    getCardXpFromDifficulty(experience.taxonomy.difficultyLevel) * dailyMultiplier
  );
  const displayXpEarned =
    xpEarned ?? (challengeCorrect ? baseXp : XP_CONFIG.WRONG_ANSWER_XP);

  const cardContent = (
    <article
      className={cn(
        "overflow-hidden rounded-xl shadow-lg",
        CARD_BASE,
        className,
        hasCompletedChallenge &&
          "border-slate-200 bg-slate-50/80 grayscale-[0.5] opacity-90 transition-all dark:border-slate-700 dark:bg-slate-900/60 hover:opacity-95 hover:grayscale-0"
      )}
    >
      <CuriosityHeader
        experience={experience}
        isDailyChallenge
        dailyMultiplier={boostRevealed ? dailyMultiplier : 1}
        completedState={
          hasCompletedChallenge && completedState
            ? { correct: completedState.correct, xpEarned: displayXpEarned }
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
              textClassName={DEFAULT_TEXT}
            />

            {!hasCompletedChallenge && experience.challenge && (
              <NextStepCallout
                slug={slug}
                experience={experience}
                onClick={() => handleTakeQuizClick()}
                xpDisplay={boostRevealed ? baseXp : getCardXpFromDifficulty(experience.taxonomy.difficultyLevel)}
                showBoost={boostRevealed}
              />
            )}

            {hasCompletedChallenge && (
              <section className="mt-8" aria-label="Challenge complete">
                <div className="flex flex-col items-center justify-center gap-3 py-6">
                  <span className="text-lg font-semibold uppercase tracking-wide">
                    Complete
                  </span>
                  {isRetry ? (
                    <XCircle
                      className="h-16 w-16 text-red-500"
                      aria-hidden
                    />
                  ) : challengeCorrect === true ? (
                    <CheckCircle2
                      className="h-16 w-16 text-emerald-500"
                      aria-hidden
                    />
                  ) : (
                    <CheckCircle2
                      className="h-16 w-16 text-slate-400"
                      aria-hidden
                    />
                  )}
                </div>
                <div className="flex items-center justify-between gap-4">
                  <Link
                    href={MOBILE_SAFE_ROUTES.curiosity(slug)}
                    className="text-sm font-medium text-muted-foreground underline-offset-4 hover:underline"
                  >
                    Review
                  </Link>
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-bold tabular-nums text-white",
                      isRetry ? "xp-badge-wrong" : "xp-badge-correct"
                    )}
                  >
                    {boostRevealed && !isRetry && (
                      <Zap className="h-3.5 w-3.5 shrink-0 fill-current" aria-hidden />
                    )}
                    +{displayXpEarned} XP
                  </span>
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

      <Dialog open={showBoostReminder} onOpenChange={setShowBoostReminder}>
        <DialogContent showCloseButton>
          <DialogHeader>
            <DialogTitle>Boost for extra XP!</DialogTitle>
            <DialogDescription className="text-sm">
              Click the Boost button above before taking the quiz to multiply your XP reward.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton={false}>
            <Button variant="outline" onClick={handleGoSpin}>
              Go boost
            </Button>
            <Button onClick={handleTakeQuizAnyway}>Take quiz anyway</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </article>
  );

  return cardContent;
}
