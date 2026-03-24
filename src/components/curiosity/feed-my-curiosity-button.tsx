"use client";

import { useCallback, useId, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import {
  useFeedRandomCuriosity,
  writeLastRandomSlug,
} from "@/hooks/mutations/useFeedRandomCuriosity";
import { setTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { cn } from "@/lib/utils";

const DIFFICULTY_OPTIONS = [
  { value: "", label: "All" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export type FeedMyCuriosityButtonProps = {
  /** When set, first random spin in the session avoids this slug (e.g. daily topic). */
  dailyTopicSlug?: string | null;
  /** Compact mode: hide long hint, lighter layout */
  compact?: boolean;
  className?: string;
};

export function FeedMyCuriosityButton({
  dailyTopicSlug,
  compact = false,
  className,
}: FeedMyCuriosityButtonProps) {
  const router = useRouter();
  const hintId = useId();
  const statusId = useId();
  const [difficulty, setDifficulty] = useState<string>("");
  const [emptyMessage, setEmptyMessage] = useState<string | null>(null);

  const mutation = useFeedRandomCuriosity();

  const handleClick = useCallback(async () => {
    mutation.reset();
    setEmptyMessage(null);
    try {
      const exp = await mutation.mutateAsync({
        difficultyLevel: difficulty || undefined,
        dailyTopicSlug,
      });
      if (!exp) {
        setEmptyMessage(
          difficulty
            ? "No published topics match that level right now. Try “All” or check back later."
            : "No published topics are available for a random pick yet."
        );
        return;
      }
      writeLastRandomSlug(exp.identity.slug);
      setTopicDiscoveryContext(exp.identity.slug, {
        wasDailyFeature: false,
        wasRandomSpin: true,
      });
      router.push(ROUTES.curiosity(exp.identity.slug));
    } catch {
      setEmptyMessage(null);
    }
  }, [mutation, difficulty, dailyTopicSlug, router]);

  const isLoading = mutation.isPending;
  const networkError = mutation.isError ? mutation.error.message : null;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <fieldset className="flex flex-wrap items-center justify-center gap-1.5 border-0 p-0">
        <legend className="sr-only">Difficulty filter for random topic</legend>
        {DIFFICULTY_OPTIONS.map((opt) => {
          const selected = difficulty === opt.value;
          return (
            <button
              key={opt.value || "all"}
              type="button"
              disabled={isLoading}
              onClick={() => setDifficulty(opt.value)}
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
        onClick={() => void handleClick()}
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

      {!compact && (
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
              onClick={() => void handleClick()}
            >
              Try again
            </button>
          </span>
        ) : emptyMessage ? (
          <span className="text-muted-foreground">{emptyMessage}</span>
        ) : null}
      </div>
    </div>
  );
}
