"use client";

import { Sparkles } from "lucide-react";

export function ActivityFeedEmpty() {
  return (
    <div className="rounded-lg border border-dashed border-slate-200/80 bg-slate-50/50 px-4 py-8 text-center dark:border-white/10 dark:bg-slate-900/30">
      <Sparkles className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
      <p className="mt-3 text-sm font-medium text-foreground">
        No activity yet
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        When curious people explore topics, their activity will show up here.
      </p>
    </div>
  );
}
