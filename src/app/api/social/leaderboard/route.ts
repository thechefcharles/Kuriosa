/**
 * Phase 10.3 — Leaderboard read API.
 * GET: window, limit, offset → ranked entries.
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { getLeaderboard } from "@/lib/services/social/get-leaderboard";
import type { LeaderboardWindow } from "@/types/leaderboard";

const VALID_WINDOWS: LeaderboardWindow[] = ["weekly", "monthly", "all_time"];

function isLeaderboardWindow(s: string): s is LeaderboardWindow {
  return VALID_WINDOWS.includes(s as LeaderboardWindow);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const windowParam = searchParams.get("window")?.trim() ?? "weekly";
  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");

  if (!isLeaderboardWindow(windowParam)) {
    return NextResponse.json(
      { ok: false as const, error: "Invalid window: weekly, monthly, or all_time" },
      { status: 400 }
    );
  }

  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 50, 100) : 50;
  const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const result = await getLeaderboard(windowParam, {
    limit,
    offset,
    currentUserId: user?.id ?? null,
  });

  return NextResponse.json({ ok: true as const, data: result });
}
