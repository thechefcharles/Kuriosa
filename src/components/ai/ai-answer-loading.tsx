"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AIAnswerLoading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-violet-200/60 bg-violet-50/40 px-4 py-3 dark:border-white/10 dark:bg-violet-950/25",
        className
      )}
      aria-live="polite"
    >
      <Loader2
        className="h-5 w-5 animate-spin text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground">
        Thinking about that…
      </p>
    </div>
  );
}
