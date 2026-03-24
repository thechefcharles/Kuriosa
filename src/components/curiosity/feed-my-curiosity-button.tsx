"use client";

import { useCallback, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import { getCardXpFromDifficulty } from "@/lib/progress/xp-config";
import {
  useFeedRandomCuriosity,
  writeLastRandomSlug,
} from "@/hooks/mutations/useFeedRandomCuriosity";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";
import {
  DIFFICULTY_BANNER,
  DEFAULT_BANNER,
  CARD_BASE,
} from "@/lib/constants/card-styles";
import { getCategoryTheme } from "@/lib/constants/category-themes";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export type FeedMyCuriosityButtonProps = {
  /** When set, first random spin in the session avoids this slug (e.g. daily topic). */
  dailyTopicSlug?: string | null;
  /** When set, random pick is restricted to topics in this category (by slug) */
  categorySlug?: string | null;
  /** When set, use this difficulty for random (e.g. from page-level filter); hides difficulty buttons */
  difficultyOverride?: string | null;
  /** Compact mode: hide long hint, lighter layout */
  compact?: boolean;
  className?: string;
};

export function FeedMyCuriosityButton({
  dailyTopicSlug,
  categorySlug = null,
  difficultyOverride = null,
  compact = false,
  className,
}: FeedMyCuriosityButtonProps) {
  const router = useRouter();
  const hintId = useId();
  const statusId = useId();
  const [internalDifficulty, setInternalDifficulty] = useState<string>("");
  const difficulty = difficultyOverride ?? internalDifficulty;
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);
  const [previewTopic, setPreviewTopic] =
    useState<LoadedCuriosityExperience | null>(null);

  const mutation = useFeedRandomCuriosity();

  const fetchRandom = useCallback(async () => {
    mutation.reset();
    setEmptyMessage(null);
    try {
      const exp = await mutation.mutateAsync({
        difficultyLevel: difficulty || undefined,
        categorySlug,
        dailyTopicSlug,
      });
      if (!exp) {
        const msg = difficulty && categorySlug
          ? "No topics at this difficulty in this category. Try a different filter."
          : categorySlug
            ? "No topics in this category right now. Try another category or All."
            : difficulty
              ? "No published topics match that level right now. Try All or check back later."
              : "No published topics are available for a random pick yet.";
        setEmptyMessage(msg);
        setPreviewTopic(null);
        return;
      }
      setPreviewTopic(exp);
    } catch {
      setEmptyMessage(null);
      setPreviewTopic(null);
    }
  }, [mutation, difficulty, categorySlug, dailyTopicSlug]);

  const handleExplore = useCallback(() => {
    if (!previewTopic) return;
    writeLastRandomSlug(previewTopic.identity.slug);
    setTopicDiscoveryContext(previewTopic.identity.slug, {
      wasDailyFeature: false,
      wasRandomSpin: true,
    });
    router.push(ROUTES.curiosity(previewTopic.identity.slug));
  }, [previewTopic, router]);

  const isLoading = mutation.isPending;
  const networkError = mutation.isError ? mutation.error.message : null;

  const diff =
    (previewTopic?.taxonomy.difficultyLevel ?? "").trim().toLowerCase();
  const bannerBg = DIFFICULTY_BANNER[diff] ?? DEFAULT_BANNER;
  const theme = previewTopic
    ? getCategoryTheme(previewTopic.taxonomy.categorySlug)
    : null;
  const Icon = theme?.icon;
  const showDifficultyButtons = difficultyOverride === undefined;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {showDifficultyButtons && (
        <fieldset className="flex flex-wrap items-center justify-center gap-1.5 border-0 p-0">
          <legend className="sr-only">Difficulty filter for random topic</legend>
          {DIFFICULTY_OPTIONS.map((opt) => {
            const selected = difficulty === opt.value;
            return (
              <button
                key={opt.value || "all"}
                type="button"
                disabled={isLoading}
                onClick={() => setInternalDifficulty(opt.value)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  selected
                    ? "border-kuriosa-deep-purple bg-kuriosa-deep-purple/15 text-kuriosa-midnight-blue dark:border-kuriosa-electric-cyan dark:bg-kuriosa-electric-cyan/15 dark:text-kuriosa-electric-cyan"
                    : "border-transparent bg-slate-100/80 text-muted-foreground hover:bg-slate-200/80 dark:bg-slate-800/80 dark:hover:bg-slate-800"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </fieldset>
      )}

      {previewTopic ? (
        <div className="space-y-3">
          <div
            className={cn(
              "overflow-hidden rounded-xl shadow-sm",
              CARD_BASE
            )}
          >
            <div className={cn("relative flex min-w-0 items-center justify-center gap-2 px-3 py-1.5", bannerBg)}>
              {theme && Icon && (
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5",
                    theme.bar,
                    "text-[10px] font-bold uppercase leading-tight tracking-wide text-white"
                  )}
                  title={previewTopic.taxonomy.category}
                >
                  <Icon className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />
                  <span className="truncate max-w-[100px]">{previewTopic.taxonomy.category}</span>
                </span>
              )}
              <span
                className={cn(
                  "absolute right-3 top-1/2 -translate-y-1/2 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-bold tabular-nums text-white",
                  theme?.bar ?? "bg-slate-600"
                )}
              >
                +{getCardXpFromDifficulty(previewTopic.taxonomy.difficultyLevel)} XP
              </span>
            </div>
            <div className="p-4">
              <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-kuriosa-midnight-blue dark:text-white">
                {previewTopic.identity.title}
              </h3>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              disabled={isLoading}
              className="flex-1 gap-2"
              onClick={() => void fetchRandom()}
            >
              <Shuffle className="h-4 w-4" aria-hidden />
              Regenerate
            </Button>
            <Button
              type="button"
              size="lg"
              className="flex-1 gap-2"
              onClick={handleExplore}
            >
              Explore
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isLoading}
          aria-busy={isLoading}
          aria-describedby={compact ? statusId : `${hintId} ${statusId}`}
          className={cn(
            "h-12 min-h-[48px] w-full border-kuriosa-deep-purple/35 bg-gradient-to-r from-violet-50/90 to-cyan-50/50 font-semibold text-kuriosa-midnight-blue shadow-sm dark:border-kuriosa-electric-cyan/35 dark:from-kuriosa-deep-purple/20 dark:to-kuriosa-midnight-blue/40 dark:text-slate-100 sm:max-w-sm sm:self-center"
          )}
          onClick={() => void fetchRandom()}
        >
          {isLoading ? (
            <span className="inline-flex items-center gap-2">
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                aria-hidden
              />
              Finding something fascinating…
            </span>
          ) : (
            <span className="inline-flex items-center gap-2">
              <Shuffle className="h-4 w-4 shrink-0" aria-hidden />
              Random curiosity
            </span>
          )}
        </Button>
      )}

      {!compact && !previewTopic && (
        <p id={hintId} className="text-center text-xs text-muted-foreground">
          We&apos;ll pick something new.
        </p>
      )}

      <div
        id={statusId}
        role="status"
        aria-live="polite"
        className="min-h-[1.25rem] text-center text-sm"
      >
        {networkError ? (
          <span className="text-destructive">
            {networkError}.{" "}
            <button
              type="button"
              className="font-medium underline underline-offset-2"
              onClick={() => void fetchRandom()}
            >
              Try again
            </button>
          </span>
        ) : emptyMessage && !previewTopic ? (
          <span className="text-muted-foreground">{emptyMessage}</span>
        ) : null}
      </div>
    </div>
  );
}
