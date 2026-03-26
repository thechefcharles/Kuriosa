"use client";

import type { CuriosityChallenge } from "@/types/curiosity-experience";
import { isMemoryRecallChallenge } from "@/lib/services/challenge/validate-challenge-answer";
import { cn } from "@/lib/utils";

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
      <div className="mb-4">
        <span className="rounded-full bg-kuriosa-electric-cyan/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-kuriosa-midnight-blue dark:text-kuriosa-electric-cyan">
          Challenge
        </span>
      </div>
      {recall ? (
        <p className="mb-4 text-sm text-muted-foreground">
          Type your answer — spelling can be casual; we match the key idea.
        </p>
      ) : null}
      <div className={recall ? undefined : "mt-4"}>{children}</div>
    </div>
  );
}
