"use client";

import type { CuriosityAudio, LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { AudioPlayer } from "@/components/curiosity/audio-player";
import { cn } from "@/lib/utils";

export function AudioPanel({
  experience,
  audioMode,
  className,
}: {
  experience: LoadedCuriosityExperience;
  audioMode: boolean;
  className?: string;
}) {
  const audio: CuriosityAudio | undefined = experience.audio;
  if (!audioMode) return null;

  const hasUrl = Boolean(audio?.audioUrl?.trim());

  return (
    <section
      className={cn(
        "rounded-2xl border border-kuriosa-electric-cyan/20 bg-gradient-to-br from-white via-violet-50/40 to-cyan-50/30 p-5 shadow-sm dark:border-kuriosa-electric-cyan/15 dark:from-slate-900 dark:via-kuriosa-deep-purple/10 dark:to-slate-900/80 sm:p-6",
        className
      )}
      aria-label="Listen to this curiosity"
    >
      <div className="mb-1 flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wide text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
          Listen
        </span>
        <span className="rounded-full bg-kuriosa-midnight-blue/10 px-2 py-0.5 text-[10px] font-medium text-kuriosa-midnight-blue dark:bg-white/10 dark:text-slate-200">
          Narration
        </span>
      </div>
      <h2 className="text-lg font-bold text-kuriosa-midnight-blue dark:text-slate-50">
        Listen to this curiosity
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {hasUrl
          ? "Press play and use the bar to jump around. Transcript below if available."
          : "Audio isn’t uploaded for this topic yet — you can still read the lesson below."}
      </p>

      {hasUrl && audio?.audioUrl ? (
        <div className="mt-5 rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-950/30">
          <AudioPlayer
            key={experience.identity.slug}
            src={audio.audioUrl}
            title={experience.identity.title}
          />
          {audio.durationSeconds != null && audio.durationSeconds > 0 ? (
            <p className="mt-3 text-center text-xs text-muted-foreground">
              About {Math.round(audio.durationSeconds / 60)} min narration
            </p>
          ) : null}
        </div>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-6 text-center text-sm text-muted-foreground">
          Audio isn&apos;t available for this curiosity yet.
        </p>
      )}

      {audio?.transcript ? (
        <div className="mt-5 rounded-xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-950/25">
          <div className="text-xs font-semibold text-foreground">Transcript</div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {audio.transcript}
          </p>
        </div>
      ) : hasUrl ? (
        <p className="mt-4 text-center text-xs text-muted-foreground">
          No transcript on file — lesson text stays below for reference.
        </p>
      ) : null}
    </section>
  );
}
