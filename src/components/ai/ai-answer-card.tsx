"use client";

import { cn } from "@/lib/utils";

export function AIAnswerCard({
  question,
  answerText,
  className,
}: {
  question: string;
  answerText: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border border-violet-200/60 bg-violet-50/50 px-3 py-3 text-sm leading-relaxed text-slate-700 dark:border-violet-900/30 dark:bg-violet-950/20 dark:text-slate-200",
        className
      )}
      role="region"
      aria-labelledby="ai-answer-question"
    >
      <p id="ai-answer-question" className="mb-2 font-medium text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
        {question}
      </p>
      <div className="whitespace-pre-wrap">{answerText.trim() || "No answer."}</div>
    </div>
  );
}
