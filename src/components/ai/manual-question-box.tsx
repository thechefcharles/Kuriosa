"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_CHARS = 500;
const MIN_CHARS = 3;

export function ManualQuestionBox({
  onSubmit,
  disabled,
  isLoading,
  topicTitle,
  requireAuth,
  onAuthRequired,
}: {
  onSubmit: (question: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  topicTitle?: string;
  requireAuth?: boolean;
  onAuthRequired?: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const trimmed = value.trim();
  const isValid = trimmed.length >= MIN_CHARS;
  const overLimit = value.length > MAX_CHARS;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (requireAuth) {
      onAuthRequired?.();
      return;
    }

    if (!trimmed) {
      setError("Type a question to continue.");
      return;
    }

    if (trimmed.length < MIN_CHARS) {
      setError(`Question must be at least ${MIN_CHARS} characters.`);
      return;
    }

    if (trimmed.length > MAX_CHARS) {
      setError(`Keep it under ${MAX_CHARS} characters.`);
      return;
    }

    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          placeholder={
            requireAuth
              ? "Sign in to ask questions about this topic"
              : topicTitle
                ? `Ask something about ${topicTitle}…`
                : "Ask something about this topic…"
          }
          maxLength={MAX_CHARS + 20}
          rows={3}
          disabled={disabled || isLoading || requireAuth}
          aria-invalid={!!error || overLimit}
          aria-describedby="manual-question-hint manual-question-error"
          className={cn(
            "w-full resize-none rounded-xl border bg-transparent px-4 py-3 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
            "border-slate-200/80 dark:border-white/10 dark:bg-slate-900/40",
            (error || overLimit) && "border-amber-400 dark:border-amber-600"
          )}
        />
        <div className="mt-1 flex items-center justify-between gap-2 px-1">
          <span
            id="manual-question-hint"
            className="text-xs text-muted-foreground"
          >
            {value.length > MAX_CHARS
              ? `${value.length - MAX_CHARS} over limit`
              : `${value.length}/${MAX_CHARS}`}
          </span>
          <Button
            type="submit"
            size="sm"
            disabled={!requireAuth && (disabled || isLoading || !isValid || overLimit)}
            className="gap-2"
          >
            {requireAuth ? (
              "Sign in to ask"
            ) : isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Asking…
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                Ask
              </>
            )}
          </Button>
        </div>
      </div>
      {error ? (
        <p id="manual-question-error" className="text-sm text-amber-600 dark:text-amber-500">
          {error}
        </p>
      ) : null}
    </form>
  );
}
