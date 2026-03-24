"use client";

import { Sparkles } from "lucide-react";
import { ShareTopicButton } from "./share-topic-button";
import { cn } from "@/lib/utils";

export type ShareTopicCardProps = {
  topicId: string;
  slug: string;
  title: string;
  hookQuestion?: string | null;
  shortSummary?: string | null;
  className?: string;
};

export function ShareTopicCard({
  topicId,
  slug,
  title,
  hookQuestion,
  shortSummary,
  className,
}: ShareTopicCardProps) {
  const shareLine = hookQuestion || shortSummary || title;
  const displayLine = shareLine?.slice(0, 120);
  const ellipsis = (shareLine?.length ?? 0) > 120 ? "…" : "";

  return (
    <div
      className={cn(
        "rounded-xl border border-violet-200/70 bg-gradient-to-br from-white to-violet-50/30 p-4 shadow-sm dark:border-white/10 dark:from-slate-900/80 dark:to-kuriosa-deep-purple/15",
        className
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-kuriosa-midnight-blue dark:text-slate-50">
            {title}
          </h3>
          {displayLine && (
            <p className="mt-1 text-sm text-muted-foreground">
              {displayLine}
              {ellipsis}
            </p>
          )}
          <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-kuriosa-electric-cyan">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Kuriosa
          </span>
        </div>
        <ShareTopicButton
          topicId={topicId}
          slug={slug}
          title={title}
          hookQuestion={hookQuestion}
          shortSummary={shortSummary}
          variant="default"
          size="sm"
          className="shrink-0"
        />
      </div>
    </div>
  );
}
