"use client";

import { cn } from "@/lib/utils";

export function FollowupAnswer({
  answerText,
  visible,
  id,
}: {
  answerText: string;
  visible: boolean;
  id: string;
}) {
  if (!visible) return null;

  return (
    <div
      id={id}
      role="region"
      className={cn(
        "mt-2 rounded-lg border border-violet-200/60 bg-violet-50/50 px-3 py-2.5 text-sm leading-relaxed text-slate-700 dark:border-violet-900/30 dark:bg-violet-950/20 dark:text-slate-200"
      )}
    >
      {answerText.trim() || "No answer on file yet."}
    </div>
  );
}
