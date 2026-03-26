/**
 * Phase 10.3 — User leaderboard position API.
 * GET: window → current user's rank.
 */

import { NextResponse } from "next/server";
import { getUserForApiRoute } from "@/lib/supabase/get-user-for-api-route";
import { getUserLeaderboardPosition } from "@/lib/services/social/get-user-leaderboard-position";
import type { LeaderboardWindow } from "@/types/leaderboard";

const VALID_WINDOWS: LeaderboardWindow[] = ["weekly", "monthly", "all_time"];

function isLeaderboardWindow(s: string): s is LeaderboardWindow {
  return VALID_WINDOWS.includes(s as LeaderboardWindow);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const windowParam = searchParams.get("window")?.trim() ?? "weekly";

  if (!isLeaderboardWindow(windowParam)) {
    return NextResponse.json(
      { ok: false as const, error: "Invalid window: weekly, monthly, or all_time" },
      { status: 400 }
    );
  }

  const user = await getUserForApiRoute(request);

  if (!user?.id) {
    return NextResponse.json(
      { ok: true as const, data: null },
      { status: 200 }
    );
  }

  const result = await getUserLeaderboardPosition(windowParam, {
    currentUserId: user.id,
  });

  return NextResponse.json({ ok: true as const, data: result });
}
