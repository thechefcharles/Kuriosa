"use client";

import { BookOpen, Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

export type CuriosityMode = "read" | "listen";

export function ModeToggle({
  mode,
  onModeChange,
  hasAudio,
}: {
  mode: CuriosityMode;
  onModeChange: (next: CuriosityMode) => void;
  hasAudio: boolean;
}) {
  const readActive = mode === "read";
  const listenActive = mode === "listen";

  return (
    <fieldset className="rounded-2xl border border-slate-200/80 bg-white/70 p-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900/50">
      <legend className="sr-only">How to experience this curiosity</legend>
      <p className="mb-2 px-2 pt-1 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground sm:text-left">
        Same story — pick how you take it in
      </p>
      <div
        className="flex gap-1.5 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-950/60"
        role="group"
        aria-label="Read or Listen"
      >
        <button
          type="button"
          onClick={() => onModeChange("read")}
          aria-pressed={readActive}
          aria-current={readActive ? "true" : undefined}
          className={cn(
            "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
            readActive
              ? "bg-white text-kuriosa-midnight-blue shadow-sm dark:bg-slate-800 dark:text-kuriosa-electric-cyan"
              : "text-muted-foreground hover:bg-white/60 dark:hover:bg-slate-800/50"
          )}
        >
          <BookOpen className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
          Read
        </button>
        {hasAudio ? (
          <button
            type="button"
            onClick={() => onModeChange("listen")}
            aria-pressed={listenActive}
            aria-current={listenActive ? "true" : undefined}
            className={cn(
              "flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
              listenActive
                ? "bg-kuriosa-midnight-blue text-white shadow-md dark:bg-kuriosa-electric-cyan dark:text-kuriosa-midnight-blue"
                : "text-muted-foreground hover:bg-white/60 dark:hover:bg-slate-800/50"
            )}
          >
            <Headphones className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
            Listen
          </button>
        ) : (
          <div
            className="flex min-h-11 flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-muted-foreground/25 bg-muted/15 px-2 py-2 text-center"
            title="Narration isn’t available for this topic yet — everything below is still here to read."
            role="note"
            aria-label="Listen unavailable. This curiosity is read-only until narration is added."
          >
            <span className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <Headphones className="h-3.5 w-3.5 opacity-50" aria-hidden />
              Listen
            </span>
            <span className="mt-0.5 text-[10px] leading-tight text-muted-foreground/90">
              No audio yet · read below
            </span>
          </div>
        )}
      </div>
    </fieldset>
  );
}
