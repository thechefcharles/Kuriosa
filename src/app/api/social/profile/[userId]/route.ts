/**
 * Phase 10.5 — Public profile API.
 * GET: userId → public profile + badges + recent topics, or private/not found.
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { getPublicProfile } from "@/lib/services/social/get-public-profile";
import { getUserBadges } from "@/lib/services/progress/get-user-badges";
import { getRecentTopics } from "@/lib/services/discovery/get-recent-topics";
import { recordProfileView } from "@/lib/services/social/record-profile-view";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  if (!userId?.trim()) {
    return NextResponse.json(
      { ok: false as const, error: "User ID required" },
      { status: 400 }
    );
  }

  const uid = userId.trim();
  const supabase = getSupabaseServiceRoleClient();
  const result = await getPublicProfile(supabase, { userId: uid });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false as const,
        error: result.error,
        notFound: result.notFound ?? false,
      },
      { status: result.notFound ? 404 : 403 }
    );
  }

  const [badges, recentTopics] = await Promise.all([
    getUserBadges(supabase, uid),
    getRecentTopics(supabase, uid),
  ]);

  const serverSupabase = await createSupabaseServerClient();
  const { data: { user } } = await serverSupabase.auth.getUser();
  recordProfileView(user?.id ?? null, uid);

  return NextResponse.json({
    ok: true as const,
    data: {
      profile: result.profile,
      badges,
      recentTopics,
    },
  });
}
