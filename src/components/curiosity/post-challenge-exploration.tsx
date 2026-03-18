"use client";

import Link from "next/link";
import { ArrowRight, Map, MessageCircleQuestion, Sparkles } from "lucide-react";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { FollowupSection } from "@/components/curiosity/followup-section";
import { TrailSection } from "@/components/curiosity/trail-section";
import {
  getDisplayableFollowups,
  getDisplayableTrails,
} from "@/lib/services/curiosity/filter-exploration-entries";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PostChallengeExploration({
  experience,
  className,
}: {
  experience: LoadedCuriosityExperience;
  className?: string;
}) {
  const currentSlug = experience.identity.slug;
  const displayTrails = getDisplayableTrails(experience.trails, currentSlug);
  const displayFollowups = getDisplayableFollowups(experience.followups);
  const hasTrailCards = displayTrails.length > 0;
  const hasFollowupCards = displayFollowups.length > 0;
  const explorationDry =
    !hasTrailCards &&
    !hasFollowupCards &&
    experience.trails.length === 0 &&
    experience.followups.length === 0;

  return (
    <section
      className={cn(
        "space-y-10 rounded-2xl border border-violet-200/55 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/45 sm:p-7",
        className
      )}
      aria-labelledby="post-challenge-heading"
    >
      <header className="border-b border-violet-100/80 pb-6 text-center dark:border-white/10">
        <Sparkles
          className="mx-auto mb-3 h-9 w-9 text-kuriosa-electric-cyan"
          aria-hidden
        />
        <h2
          id="post-challenge-heading"
          className="text-xl font-bold tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-2xl"
        >
          What&apos;s next?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
          You&apos;ve earned this beat — go deeper with quick follow-ups, then step into the next
          curiosity when you&apos;re ready.
        </p>
      </header>

      {explorationDry ? (
        <div className="rounded-xl border border-dashed border-violet-200/60 bg-violet-50/20 px-5 py-10 text-center dark:border-white/10 dark:bg-slate-950/30">
          <p className="text-sm font-medium text-kuriosa-midnight-blue dark:text-slate-200">
            More angles are on the way
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            This topic doesn&apos;t list extra questions or trails yet. Hop back to Discover or try
            another random curiosity.
          </p>
          <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={ROUTES.discover}
              className={cn(
                buttonVariants(),
                "min-h-11 w-full gap-2 sm:w-auto sm:min-w-[160px]"
              )}
            >
              <Map className="h-4 w-4" aria-hidden />
              Discover
            </Link>
            <Link
              href={ROUTES.home}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "min-h-11 w-full gap-2 sm:w-auto"
              )}
            >
              Home
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2 dark:border-white/10">
              <MessageCircleQuestion
                className="h-5 w-5 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan"
                aria-hidden
              />
              <h3 className="text-sm font-bold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
                Dig deeper
              </h3>
              <span className="text-xs font-normal normal-case text-muted-foreground">
                — quick questions
              </span>
            </div>
            <FollowupSection
              followups={displayFollowups}
              rawFollowupCount={experience.followups.length}
            />
          </div>

          <div className="space-y-4 border-t border-slate-200/60 pt-8 dark:border-white/10">
            <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2 dark:border-white/10">
              <Map
                className="h-5 w-5 text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan"
                aria-hidden
              />
              <h3 className="text-sm font-bold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
                Keep going
              </h3>
              <span className="text-xs font-normal normal-case text-muted-foreground">
                — next curiosities
              </span>
            </div>
            <TrailSection trails={displayTrails} rawTrailCount={experience.trails.length} />
          </div>
        </>
      )}
    </section>
  );
}
