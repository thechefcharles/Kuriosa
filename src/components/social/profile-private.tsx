"use client";

import { Lock } from "lucide-react";

export function ProfilePrivate() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 px-6 py-12 text-center dark:border-white/10 dark:bg-slate-900/30">
      <Lock className="h-12 w-12 text-slate-400 dark:text-slate-500" aria-hidden />
      <p className="mt-4 text-base font-medium text-foreground">
        This profile is private.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        This person has chosen to keep their curiosity journey private.
      </p>
    </div>
  );
}
