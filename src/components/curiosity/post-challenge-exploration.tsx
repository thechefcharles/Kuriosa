"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Map, Sparkles } from "lucide-react";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { FollowupSection } from "@/components/curiosity/followup-section";
import { TrailCard } from "@/components/curiosity/trail-card";
import { TrailSection } from "@/components/curiosity/trail-section";
import { AIExplorationBlock } from "@/components/ai/ai-exploration-block";
import {
  getDisplayableFollowups,
  getDisplayableTrails,
} from "@/lib/services/curiosity/filter-exploration-entries";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PostChallengeExploration({
  experience,
  hasCompletedChallenge = false,
  className,
}: {
  experience: LoadedCuriosityExperience;
  /** True when user completed the challenge for this topic */
  hasCompletedChallenge?: boolean;
  className?: string;
}) {
  const currentSlug = experience.identity.slug;
  const displayTrails = getDisplayableTrails(experience.trails, currentSlug);
  const displayFollowups = getDisplayableFollowups(experience.followups);
  const hasTrailCards = displayTrails.length > 0;
  const hasFollowupCards = displayFollowups.length > 0;
  const topicId = experience.identity.id;
  const topicTitle = experience.identity.title ?? experience.discoveryCard.hookQuestion;
  const explorationDry =
    !hasTrailCards &&
    !hasFollowupCards &&
    experience.trails.length === 0 &&
    experience.followups.length === 0;

  const primaryTrail = displayTrails[0];
  const secondaryTrail = displayTrails[1];
  const [goDeeperOpen, setGoDeeperOpen] = useState(false);

  if (!hasCompletedChallenge) {
    return null;
  }

  return (
    <section
      className={cn(
        "space-y-6 rounded-2xl border border-violet-200/55 bg-white/75 p-5 shadow-sm dark:border-white/10 dark:bg-slate-900/45 sm:p-7",
        className
      )}
      aria-labelledby="post-challenge-heading"
    >
      <header className="border-b border-violet-100/80 pb-5 text-center dark:border-white/10">
        <h2
          id="post-challenge-heading"
          className="text-xl font-bold tracking-tight text-kuriosa-midnight-blue dark:text-slate-50 sm:text-2xl"
        >
          What&apos;s next?
        </h2>
        <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
          One clear path forward — or dig deeper if you like.
        </p>
      </header>

      {explorationDry ? (
        <DryState
          currentSlug={currentSlug}
          topicId={topicId}
          topicTitle={topicTitle}
        />
      ) : (
        <>
          {primaryTrail ? (
            <>
              {/* Primary: first trail */}
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
                  Next curiosity
                </p>
                <TrailCard trail={primaryTrail} />
              </div>

              {/* Secondary: second trail or Discover */}
              <div className="flex flex-wrap items-center gap-3">
                {secondaryTrail ? (
                  <TrailCard trail={secondaryTrail} />
                ) : (
                  <Link
                    href={ROUTES.discover}
                    className={cn(
                      "inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200/90 bg-white/80 px-4 py-2.5 text-sm font-medium text-kuriosa-midnight-blue transition-colors hover:border-kuriosa-electric-cyan/40 hover:bg-violet-50/50 dark:border-white/15 dark:bg-slate-900/60 dark:text-slate-100 dark:hover:border-kuriosa-electric-cyan/30",
                      "active:scale-[0.99]"
                    )}
                  >
                    <Map className="h-4 w-4" aria-hidden />
                    Browse more
                  </Link>
                )}
              </div>
            </>
          ) : (
            /* No trails: show followups + Browse */
            <div className="space-y-4">
              {hasFollowupCards ? (
                <FollowupSection
                  followups={displayFollowups}
                  rawFollowupCount={experience.followups.length}
                />
              ) : null}
              <Link
                href={ROUTES.discover}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "inline-flex min-h-11 gap-2"
                )}
              >
                <Map className="h-4 w-4" aria-hidden />
                Browse Discover
              </Link>
            </div>
          )}

          {/* Collapsed: followups + AI + remaining trails (only when we have trails) */}
          {primaryTrail && (
          <div className="border-t border-slate-200/60 pt-6 dark:border-white/10">
              <Button
                type="button"
                variant="ghost"
                className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-white/60 hover:text-kuriosa-deep-purple dark:hover:bg-slate-800/60 dark:hover:text-kuriosa-electric-cyan"
                onClick={() => setGoDeeperOpen((v) => !v)}
                aria-expanded={goDeeperOpen}
              >
                <span>Go deeper</span>
                <ChevronDown
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform",
                    goDeeperOpen && "rotate-180"
                  )}
                  aria-hidden
                />
              </Button>
              {goDeeperOpen ? (
                <div className="mt-4 space-y-6">
                  {hasFollowupCards ? (
                    <FollowupSection
                      followups={displayFollowups}
                      rawFollowupCount={experience.followups.length}
                    />
                  ) : null}
                  <AIExplorationBlock
                    slug={currentSlug}
                    topicId={topicId}
                    topicTitle={topicTitle}
                  />
                  {displayTrails.length > 2 ? (
                    <TrailSection
                      trails={displayTrails.slice(2)}
                      rawTrailCount={experience.trails.length}
                    />
                  ) : null}
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </section>
  );
}

function DryState({
  currentSlug,
  topicId,
  topicTitle,
}: {
  currentSlug: string;
  topicId: string;
  topicTitle: string;
}) {
  const [goDeeperOpen, setGoDeeperOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-dashed border-violet-200/60 bg-violet-50/20 px-5 py-8 text-center dark:border-white/10 dark:bg-slate-950/30">
        <p className="text-sm font-medium text-kuriosa-midnight-blue dark:text-slate-200">
          Ready for the next rabbit hole
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          No trails from this topic yet — hop to Discover or ask the AI below.
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={ROUTES.discover}
            className={cn(
              buttonVariants(),
              "min-h-11 w-full gap-2 sm:w-auto sm:min-w-[140px]"
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
            Surprise me
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-200/60 pt-6 dark:border-white/10">
        <Button
          type="button"
          variant="ghost"
          className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-muted-foreground hover:bg-white/60 hover:text-kuriosa-deep-purple dark:hover:bg-slate-800/60 dark:hover:text-kuriosa-electric-cyan"
          onClick={() => setGoDeeperOpen((v) => !v)}
          aria-expanded={goDeeperOpen}
        >
          <span>
            <Sparkles className="mr-1.5 inline h-4 w-4 text-kuriosa-electric-cyan" />
            Ask AI or explore more
          </span>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 transition-transform",
              goDeeperOpen && "rotate-180"
            )}
            aria-hidden
          />
        </Button>
        {goDeeperOpen ? (
          <div className="mt-4">
            <AIExplorationBlock
              slug={currentSlug}
              topicId={topicId}
              topicTitle={topicTitle}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
