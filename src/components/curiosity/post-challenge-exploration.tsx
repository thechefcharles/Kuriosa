"use client";

import { Sparkles } from "lucide-react";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { FollowupSection } from "@/components/curiosity/followup-section";
import { TrailSection } from "@/components/curiosity/trail-section";
import { cn } from "@/lib/utils";

export function PostChallengeExploration({
  experience,
  className,
}: {
  experience: LoadedCuriosityExperience;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "space-y-8 rounded-2xl border border-violet-200/50 bg-white/70 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/40 sm:p-6",
        className
      )}
      aria-labelledby="post-challenge-heading"
    >
      <div className="text-center">
        <Sparkles
          className="mx-auto mb-2 h-8 w-8 text-kuriosa-electric-cyan"
          aria-hidden
        />
        <h2
          id="post-challenge-heading"
          className="text-xl font-bold text-kuriosa-midnight-blue dark:text-slate-50"
        >
          Curious about more?
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          You&apos;ve wrapped the challenge — dig deeper with follow-ups, then hop to a related
          curiosity.
        </p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
          Follow-up questions
        </h3>
        <FollowupSection followups={experience.followups} />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
          Explore next
        </h3>
        <TrailSection trails={experience.trails} />
      </div>
    </section>
  );
}
