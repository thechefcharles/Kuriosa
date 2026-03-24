"use client";

import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ManualQuestionResult } from "@/types/ai";
import { cn } from "@/lib/utils";

export function AIAnswerError({
  result,
  onRetry,
  className,
}: {
  result: Extract<ManualQuestionResult, { ok: false }>;
  onRetry: () => void;
  className?: string;
}) {
  const isRateLimited = result.rateLimited;
  const message =
    result.answerText && result.answerText.trim()
      ? result.answerText
      : isRateLimited
        ? "You're asking a lot of great questions. Take a breather and try again in a minute."
        : result.error ?? "Something went wrong. Try again when you're ready.";

  return (
    <div
      className={cn(
        "rounded-lg border border-amber-200/70 bg-amber-50/50 px-3 py-3 dark:border-amber-900/40 dark:bg-amber-950/20",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">{message}</p>
      <Button
        variant="outline"
        size="sm"
        onClick={onRetry}
        disabled={isRateLimited}
        className="mt-3 gap-2"
      >
        <RefreshCw className="h-4 w-4" aria-hidden />
        Try again
      </Button>
    </div>
  );
}
