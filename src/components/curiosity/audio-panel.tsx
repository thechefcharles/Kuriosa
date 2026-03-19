"use client";

import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { AudioPlayer } from "@/components/curiosity/audio-player";
import { AudioCompleteCallout } from "@/components/curiosity/audio-complete-callout";
import { TranscriptCollapsible } from "@/components/curiosity/transcript-collapsible";
import { cn } from "@/lib/utils";

/**
 * Listen surface: full chrome in Listen mode; player stays mounted off-screen in Read mode
 * so playback continues when switching modes (same page session).
 */
export function AudioPanel({
  experience,
  audioMode,
  audioPlaybackFinished,
  onAudioPlaybackEnded,
  onAudioPlaybackBegan,
  className,
}: {
  experience: LoadedCuriosityExperience;
  audioMode: boolean;
  /** True after natural playback end until user plays again */
  audioPlaybackFinished: boolean;
  onAudioPlaybackEnded: () => void;
  onAudioPlaybackBegan: () => void;
  className?: string;
}) {
  const audio = experience.audio;
  if (audio == null) return null;

  const title = experience.identity.title;

  return (
    <section
      className={cn(
        audioMode
          ? "mb-2 rounded-2xl border-2 border-kuriosa-electric-cyan/25 bg-gradient-to-b from-white via-violet-50/30 to-cyan-50/20 p-6 shadow-md dark:border-kuriosa-electric-cyan/20 dark:from-slate-900 dark:via-kuriosa-deep-purple/10 dark:to-slate-950 sm:p-8"
          : "pointer-events-none fixed left-[-10000px] top-0 h-px w-px overflow-hidden opacity-0",
        className
      )}
      aria-label={audioMode ? "Listen to narration" : undefined}
      aria-hidden={!audioMode}
    >
      {audioMode ? (
        <header className="mb-6 text-center sm:text-left">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-kuriosa-electric-cyan">
            Listen mode
          </p>
          <h2 className="mt-1.5 text-xl font-bold tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            Press play when you&apos;re ready. Switch to Read anytime — the written lesson is always
            there. Playback pauses if you leave this page.
          </p>
        </header>
      ) : null}

      <div
        className={cn(
          "rounded-2xl border border-slate-200/90 bg-white/95 p-5 shadow-inner dark:border-white/10 dark:bg-slate-950/50 sm:p-6",
          audioMode && "ring-1 ring-kuriosa-electric-cyan/10"
        )}
      >
        <AudioPlayer
          key={experience.identity.slug}
          src={audio.audioUrl}
          title={title}
          onPlaybackEnded={onAudioPlaybackEnded}
          onPlaybackBegan={onAudioPlaybackBegan}
        />
        {audioMode && audio.durationSeconds != null && audio.durationSeconds > 0 ? (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            About {Math.ceil(audio.durationSeconds / 60)} min narration
          </p>
        ) : null}
      </div>

      {audioMode ? (
        <>
          <div className="mt-6">
            <TranscriptCollapsible
              transcript={
                audio.transcript?.trim()
                  ? audio.transcript
                  : experience.lesson.lessonText?.trim()
                    ? experience.lesson.lessonText
                    : null
              }
              emptyHint="We don’t have a separate transcript for this one — scroll to the written lesson below; it matches what you’d hear when audio works."
            />
          </div>
          {audioPlaybackFinished ? (
            <AudioCompleteCallout
              slug={experience.identity.slug}
              hasChallenge={Boolean(experience.challenge)}
            />
          ) : null}
        </>
      ) : null}
    </section>
  );
}
