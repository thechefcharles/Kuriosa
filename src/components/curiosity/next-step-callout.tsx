"use client";

import Link from "next/link";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  XP_CONFIG,
  DIFFICULTY_MULTIPLIERS,
} from "@/lib/progress/xp-config";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";

function getChallengeXp(experience: LoadedCuriosityExperience): number {
  const base = XP_CONFIG.CHALLENGE_COMPLETION_XP;
  const mult =
    DIFFICULTY_MULTIPLIERS[
      experience.taxonomy.difficultyLevel as keyof typeof DIFFICULTY_MULTIPLIERS
    ] ?? 1;
  return Math.round(base * mult);
}

export function NextStepCallout({
  slug,
  experience,
}: {
  slug: string;
  experience: LoadedCuriosityExperience;
}) {
  const xp = getChallengeXp(experience);

  return (
    <section className="mt-8" aria-label="Earn XP">
      <div className="flex justify-center sm:justify-end">
        <Link
          href={ROUTES.challenge(slug)}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap bg-emerald-500 px-6 text-white hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          )}
        >
          Earn +{xp} XP
        </Link>
      </div>
    </section>
  );
}

