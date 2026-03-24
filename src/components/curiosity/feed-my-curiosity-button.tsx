"use client";

import { useCallback, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import {
  useFeedRandomCuriosity,
  writeLastRandomSlug,
} from "@/hooks/mutations/useFeedRandomCuriosity";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import type { LoadedCuriosityExperience } from "@/types/curiosity-experience";
import { cn } from "@/lib/utils";

const DIFFICULTY_CARD_STYLES: Record<string, string> = {
  beginner: "border-emerald-300/70 bg-emerald-50/90 dark:border-emerald-700/50 dark:bg-emerald-950/40",
  easy: "border-emerald-300/70 bg-emerald-50/90 dark:border-emerald-700/50 dark:bg-emerald-950/40",
  intermediate: "border-amber-300/70 bg-amber-50/90 dark:border-amber-800/50 dark:bg-amber-950/40",
  advanced: "border-rose-300/70 bg-rose-50/90 dark:border-rose-800/50 dark:bg-rose-950/40",
  expert: "border-rose-300/70 bg-rose-50/90 dark:border-rose-800/50 dark:bg-rose-950/40",
};

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
  const cardStyle =
    DIFFICULTY_CARD_STYLES[diff] ??
    "border-slate-200/90 bg-white/90 dark:border-white/10 dark:bg-slate-900/60";

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
          <div className={cn("rounded-xl border p-4 shadow-sm", cardStyle)}>
            <h3 className="line-clamp-3 text-sm font-semibold leading-snug text-kuriosa-midnight-blue dark:text-white">
              {previewTopic.identity.title}
            </h3>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              {previewTopic.taxonomy.category}
            </p>
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
