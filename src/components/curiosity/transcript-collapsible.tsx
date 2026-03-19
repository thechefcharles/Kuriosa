"use client";

import { useEffect, useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SHORT_TRANSCRIPT_MAX_CHARS = 420;

type TranscriptCollapsibleProps = {
  transcript: string | null;
  /** Shown when there is no transcript string */
  emptyHint?: string;
  className?: string;
};

export function TranscriptCollapsible({
  transcript,
  emptyHint = "No separate transcript — the written lesson below matches what you’re hearing.",
  className,
}: TranscriptCollapsibleProps) {
  const panelId = useId();
  const trimmed = transcript?.trim() ?? "";
  const hasBody = trimmed.length > 0;
  const long = trimmed.length > SHORT_TRANSCRIPT_MAX_CHARS;
  const [open, setOpen] = useState(!long && hasBody);

  useEffect(() => {
    setOpen(!long && hasBody);
  }, [hasBody, long, trimmed]);

  if (!hasBody) {
    return (
      <p className="text-center text-sm text-muted-foreground">{emptyHint}</p>
    );
  }

  return (
    <div className={cn("border-t border-slate-200/80 pt-5 dark:border-white/10", className)}>
      <Button
        type="button"
        variant="ghost"
        className="flex h-12 min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-slate-200/90 bg-white/70 px-4 text-left font-semibold text-kuriosa-midnight-blue hover:bg-slate-50 dark:border-white/10 dark:bg-slate-900/50 dark:text-slate-100 dark:hover:bg-slate-800/80"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        id={`${panelId}-trigger`}
      >
        <span>
          Transcript
          {long ? (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              (tap to {open ? "hide" : "read along"})
            </span>
          ) : null}
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-kuriosa-electric-cyan transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </Button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={`${panelId}-trigger`}
        className={cn(
          "overflow-hidden transition-[max-height,opacity] duration-200 ease-out",
          open ? "mt-3 max-h-[min(55vh,28rem)] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div
          className="max-h-[min(55vh,28rem)] overflow-y-auto rounded-xl border border-slate-200/70 bg-slate-50/90 p-4 text-sm leading-relaxed text-slate-800 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-200"
          tabIndex={open ? 0 : -1}
        >
          {trimmed.split(/\n{2,}/).map((para, i) => (
            <p key={i} className="mb-3 last:mb-0">
              {para.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
