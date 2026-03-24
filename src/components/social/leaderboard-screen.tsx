"use client";

import { useState, useCallback } from "react";
import { useLeaderboard } from "@/hooks/queries/useLeaderboard";
import { useUserLeaderboardPosition } from "@/hooks/queries/useUserLeaderboardPosition";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import type { LeaderboardWindow } from "@/types/leaderboard";
import { LeaderboardWindowTabs } from "./leaderboard-window-tabs";
import { LeaderboardList } from "./leaderboard-list";
import { UserRankCard } from "./user-rank-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

export function LeaderboardScreen() {
  const [window, setWindow] = useState<LeaderboardWindow>("weekly");
  const { data: userId } = useAuthUserId();
  const isSignedIn = Boolean(userId);

  const leaderboard = useLeaderboard(window, { limit: 50 });
  const position = useUserLeaderboardPosition(window);

  const handleWindowChange = useCallback((w: LeaderboardWindow) => {
    setWindow(w);
  }, []);

  return (
    <div className="space-y-6">
      <LeaderboardWindowTabs value={window} onValueChange={handleWindowChange} />

      <UserRankCard
        position={position.data ?? null}
        window={window}
        isSignedIn={isSignedIn}
      />

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
          Top Explorers
        </h2>

        {leaderboard.isPending || leaderboard.isLoading ? (
          <LoadingState />
        ) : leaderboard.isError ? (
          <ErrorState
            message={
              leaderboard.error?.message ??
              "Leaderboard didn’t load. Your curiosity is still growing — try again later."
            }
          />
        ) : !leaderboard.data?.entries?.length ? (
          <EmptyState
            title="No rankings yet"
            description="Be the first to explore and earn your place on the leaderboard."
          />
        ) : (
          <LeaderboardList entries={leaderboard.data.entries} />
        )}
      </section>
    </div>
  );
}
