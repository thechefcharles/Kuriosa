"use client";

import { LeaderboardRow } from "./leaderboard-row";
import type { LeaderboardEntryView } from "@/types/leaderboard";

interface LeaderboardListProps {
  entries: LeaderboardEntryView[];
}

export function LeaderboardList({ entries }: LeaderboardListProps) {
  if (entries.length === 0) return null;

  return (
    <div className="space-y-1">
      {entries.map((entry) => (
        <LeaderboardRow key={`${entry.userId}-${entry.rank}`} entry={entry} />
      ))}
    </div>
  );
}
