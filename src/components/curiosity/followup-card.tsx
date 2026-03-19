"use client";

import { ChevronDown } from "lucide-react";
import type { CuriosityFollowup } from "@/types/curiosity-experience";
import { FollowupAnswer } from "@/components/curiosity/followup-answer";
import { cn } from "@/lib/utils";

const MAX_QUESTION_PREVIEW = 120;

export function FollowupCard({
  followup,
  expanded,
  onToggle,
  answerRegionId,
}: {
  followup: CuriosityFollowup;
  expanded: boolean;
  onToggle: () => void;
  answerRegionId: string;
}) {
  const q = followup.questionText.trim();
  const preview =
    q.length > MAX_QUESTION_PREVIEW ? `${q.slice(0, MAX_QUESTION_PREVIEW)}…` : q;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/70 dark:border-white/10 dark:bg-slate-900/50">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={answerRegionId}
        className="flex w-full min-h-12 items-start gap-2 px-4 py-3 text-left transition-colors hover:bg-violet-50/50 dark:hover:bg-violet-950/15"
      >
        <ChevronDown
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0 text-kuriosa-deep-purple transition-transform dark:text-kuriosa-electric-cyan",
            expanded && "rotate-180"
          )}
          aria-hidden
        />
        <span className="text-[15px] font-medium leading-snug text-foreground">
          {expanded ? q : preview}
        </span>
      </button>
      {expanded ? (
        <div className="px-4 pb-3">
          <FollowupAnswer
            id={answerRegionId}
            answerText={followup.answerText ?? ""}
            visible
          />
        </div>
      ) : null}
    </div>
  );
}
