"use client";

import { Route } from "lucide-react";
import type { CuriosityTrail } from "@/types/curiosity-experience";
import { TrailCard } from "@/components/curiosity/trail-card";

export function TrailSection({ trails }: { trails: CuriosityTrail[] }) {
  const sorted = [...trails].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-6 text-center">
        <Route className="mx-auto mb-2 h-8 w-8 text-muted-foreground/70" aria-hidden />
        <p className="text-sm text-muted-foreground">
          No next curiosities linked yet — this rabbit hole ends here for now.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sorted.map((t) => (
        <TrailCard key={`${t.toTopicSlug}-${t.sortOrder}`} trail={t} />
      ))}
    </div>
  );
}
