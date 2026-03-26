/**
 * Phase 10.4 — Activity feed API.
 * GET: limit, offset → enriched feed items.
 */

import { NextResponse } from "next/server";
import { getActivityFeed } from "@/lib/services/social/get-activity-feed";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = searchParams.get("limit");
  const offsetParam = searchParams.get("offset");

  const limit = limitParam ? Math.min(parseInt(limitParam, 10) || 20, 50) : 20;
  const offset = offsetParam ? Math.max(0, parseInt(offsetParam, 10) || 0) : 0;

  const result = await getActivityFeed({ limit, offset });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false as const, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true as const, data: result.items });
}
