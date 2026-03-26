/**
 * Phase 9.4 — Guided topic exploration API.
 * GET: topic slug or id → follow-ups + rabbit holes.
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { getGuidedTopicExploration } from "@/lib/services/ai/get-guided-topic-exploration";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug")?.trim();
  const topicId = searchParams.get("topicId")?.trim();

  if (!slug && !topicId) {
    return NextResponse.json(
      { ok: false as const, error: "slug or topicId required" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const input = slug ? { slug } : { topicId: topicId! };
  const result = await getGuidedTopicExploration(input, {
    userId: user?.id ?? undefined,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 404 });
  }

  return NextResponse.json(result);
}
