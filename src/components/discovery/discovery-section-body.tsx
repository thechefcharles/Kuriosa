"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Loading / empty / error shells for discovery sections. */
export function DiscoverySectionSkeleton({ rows = 2 }: { rows?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
      {Array.from({ length: rows * 3 }).map((_, i) => (
        <div
          key={i}
          className="h-[180px] animate-pulse rounded-xl bg-muted/80"
        />
      ))}
    </div>
  );
}

export function DiscoverySectionEmpty({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-violet-300/50 bg-violet-50/30 px-5 py-10 text-center dark:border-white/10 dark:bg-slate-900/40">
      <p className="font-medium text-kuriosa-midnight-blue dark:text-slate-100">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export function DiscoverySectionError({ message }: { message: string }) {
  return (
    <div
      className="rounded-xl border border-amber-200/60 bg-amber-50/50 px-4 py-3 text-sm text-amber-950 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-100"
      role="alert"
    >
      {message}
    </div>
  );
}

export function DiscoveryCardGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ul
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </ul>
  );
}
