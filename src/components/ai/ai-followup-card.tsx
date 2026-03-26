"use client";

import { ChevronDown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_PREVIEW = 100;
const LABELS = [
  "Ask AI next",
  "Go deeper",
  "Curious about…",
] as const;

export function AIFollowupCard({
  question,
  label,
  expanded,
  onToggle,
  answerSlot,
}: {
  question: string;
  label?: string;
  expanded: boolean;
  onToggle: () => void;
  answerSlot: React.ReactNode;
}) {
  const preview =
    question.length > MAX_PREVIEW ? `${question.slice(0, MAX_PREVIEW)}…` : question;
  const displayLabel = label ?? LABELS[Math.abs(question.length) % LABELS.length];

  return (
    <div className="rounded-xl border border-violet-200/70 bg-gradient-to-br from-white to-violet-50/30 dark:border-white/10 dark:from-slate-900/80 dark:to-kuriosa-deep-purple/15">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full min-h-12 items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-violet-50/50 dark:hover:bg-violet-950/20"
      >
        <span
          className="shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-kuriosa-electric-cyan/20"
          aria-hidden
        >
          <Sparkles className="h-3.5 w-3.5 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan" />
        </span>
        <span className="flex-1 min-w-0">
          <span className="block text-[10px] font-bold uppercase tracking-wider text-kuriosa-electric-cyan dark:text-kuriosa-electric-cyan/90">
            {displayLabel}
          </span>
          <span className="mt-0.5 block text-[15px] font-medium leading-snug text-foreground">
            {expanded ? question : preview}
          </span>
        </span>
        <ChevronDown
          className={cn(
            "mt-1 h-5 w-5 shrink-0 text-kuriosa-deep-purple transition-transform dark:text-kuriosa-electric-cyan",
            expanded && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      {expanded ? <div className="px-4 pb-3 pt-0">{answerSlot}</div> : null}
    </div>
  );
}
