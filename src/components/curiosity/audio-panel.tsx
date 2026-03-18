"use client";

import type { CuriosityAudio, LoadedCuriosityExperience } from "@/types/curiosity-experience";
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

  return (
    <section
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white/60 p-5 dark:border-white/10 dark:bg-slate-900/40",
        className
      )}
      aria-label="Audio section"
    >
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
        Audio mode
      </div>

      {audio?.audioUrl ? (
        <>
          <p className="text-sm text-slate-700 dark:text-slate-200">
            Audio isn&apos;t fully controlled yet, but your narration source is ready.
          </p>
          <p className="mt-2 break-all text-xs text-muted-foreground">
            {audio.audioUrl}
          </p>
          {audio.transcript ? (
            <div className="mt-4 rounded-xl border border-slate-200/70 bg-slate-50/60 p-4 dark:border-white/10 dark:bg-slate-950/20">
              <div className="text-xs font-semibold text-foreground">Transcript</div>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {audio.transcript}
              </p>
            </div>
          ) : null}
        </>
      ) : (
        <p className="text-sm text-muted-foreground">
          Audio isn&apos;t available for this curiosity yet.
        </p>
      )}
    </section>
  );
}

