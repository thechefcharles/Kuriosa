"use client";

import type { PublicProfileView } from "@/types/social";
import { Sparkles, Award, BookOpen, Target } from "lucide-react";

interface ProfileStatsProps {
  profile: PublicProfileView;
  /** Optional: highlight when this stat beats current viewer */
  currentUserStats?: {
    curiosityScore: number;
    level: number;
    topicsExploredCount: number;
    badgesCount: number;
  };
}

const StatItem = ({
  icon: Icon,
  label,
  value,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  highlight?: boolean;
}) => (
  <div
    className={`flex flex-col items-center rounded-lg px-4 py-3 ${
      highlight ? "bg-violet-50/80 dark:bg-violet-950/40" : ""
    }`}
  >
    <Icon className="h-5 w-5 text-violet-600 dark:text-violet-400" aria-hidden />
    <span className="mt-1 text-lg font-semibold tabular-nums text-foreground">
      {value}
    </span>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

export function ProfileStats({ profile, currentUserStats }: ProfileStatsProps) {
  const hasComparison = Boolean(currentUserStats);

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white/80 p-4 dark:border-white/10 dark:bg-slate-900/40">
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Curiosity stats
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <StatItem
          icon={Sparkles}
          label="Curiosity score"
          value={profile.curiosityScore}
          highlight={
            hasComparison &&
            profile.curiosityScore > (currentUserStats?.curiosityScore ?? 0)
          }
        />
        <StatItem
          icon={Target}
          label="Level"
          value={profile.level}
          highlight={
            hasComparison && profile.level > (currentUserStats?.level ?? 0)
          }
        />
        <StatItem
          icon={BookOpen}
          label="Topics explored"
          value={profile.topicsExploredCount}
          highlight={
            hasComparison &&
            profile.topicsExploredCount >
              (currentUserStats?.topicsExploredCount ?? 0)
          }
        />
        <StatItem
          icon={Award}
          label="Badges"
          value={profile.badgesCount}
          highlight={
            hasComparison &&
            profile.badgesCount > (currentUserStats?.badgesCount ?? 0)
          }
        />
      </div>
    </div>
  );
}
