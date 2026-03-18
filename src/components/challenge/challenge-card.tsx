"use client";

import type { CuriosityChallenge } from "@/types/curiosity-experience";
import {
  isMemoryRecallChallenge,
  normalizeQuizType,
} from "@/lib/services/challenge/validate-challenge-answer";
import { cn } from "@/lib/utils";

function typeLabel(challenge: CuriosityChallenge): string {
  const t = normalizeQuizType(challenge.quizType);
  if (t === "memory_recall" || t === "recall") return "Memory recall";
  if (t === "logic") return "Logic";
  if (t === "reasoning") return "Reasoning";
  return "Multiple choice";
}

export function ChallengeCard({
  challenge,
  children,
  className,
}: {
  challenge: CuriosityChallenge;
  children: React.ReactNode;
  className?: string;
}) {
  const recall = isMemoryRecallChallenge(challenge);

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white via-violet-50/30 to-white p-5 shadow-sm dark:border-white/10 dark:from-slate-900 dark:via-kuriosa-deep-purple/10 dark:to-slate-900 sm:p-6",
        className
      )}
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-kuriosa-electric-cyan/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan">
          Challenge
        </span>
        <span className="text-xs font-medium text-muted-foreground">{typeLabel(challenge)}</span>
        {challenge.difficultyLevel ? (
          <span className="text-xs text-muted-foreground">
            · {challenge.difficultyLevel}
          </span>
        ) : null}
      </div>
      <h2 className="text-xl font-bold leading-snug text-kuriosa-midnight-blue dark:text-slate-50 sm:text-2xl">
        {challenge.questionText}
      </h2>
      {recall ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Type your answer — spelling can be casual; we match the key idea.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">Tap the option that fits best.</p>
      )}
      <div className="mt-6">{children}</div>
    </div>
  );
}
