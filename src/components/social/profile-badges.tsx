"use client";

import type { UserBadgeView } from "@/types/progress-view";
import { Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileBadgesProps {
  badges: UserBadgeView[];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? "").join("") || "?";
}

export function ProfileBadges({ badges }: ProfileBadgesProps) {
  if (badges.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 px-4 py-6 text-center dark:border-white/10 dark:bg-slate-900/30">
        <Award className="mx-auto h-10 w-10 text-slate-300 dark:text-slate-600" />
        <p className="mt-3 text-sm text-muted-foreground">
          No badges yet — explore topics to unlock some.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/40">
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Badges earned
      </h2>
      <div className="flex flex-wrap gap-2">
        {badges.slice(0, 12).map((badge) => {
          const showIcon = badge.icon && /^https?:\/\//i.test(badge.icon);
          return (
            <div
              key={badge.badgeId}
              className="flex items-center gap-2 rounded-lg border border-violet-200/60 bg-violet-50/50 px-3 py-2 dark:border-violet-800/50 dark:bg-violet-950/30"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-violet-400 to-violet-600 text-white">
                {showIcon ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={badge.icon!}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold">
                    {initials(badge.name)}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-foreground">
                {badge.name}
              </span>
            </div>
          );
        })}
        {badges.length > 12 && (
          <span className="self-center text-xs text-muted-foreground">
            +{badges.length - 12} more
          </span>
        )}
      </div>
    </div>
  );
}
