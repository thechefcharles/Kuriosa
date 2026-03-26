/**
 * Phase 10.5 — Profile privacy settings API.
 * GET: current user's privacy settings
 * PATCH: update privacy settings
 */

import { NextResponse } from "next/server";
import { getUserForApiRoute } from "@/lib/supabase/get-user-for-api-route";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { getProfilePrivacy } from "@/lib/services/social/get-profile-privacy";
import { updateProfileSettings } from "@/lib/services/social/update-profile-settings";

export async function GET(request: Request) {
  const user = await getUserForApiRoute(request);

  if (!user?.id) {
    return NextResponse.json(
      { ok: false as const, error: "Sign in required" },
      { status: 401 }
    );
  }

  let supabase;
  try {
    supabase = getSupabaseServiceRoleClient();
  } catch {
    return NextResponse.json(
      { ok: false as const, error: "Server configuration error" },
      { status: 500 }
    );
  }

  const result = await getProfilePrivacy(supabase, user.id);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false as const, error: result.error },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true as const, data: result.settings });
}

export async function PATCH(request: Request) {
  const user = await getUserForApiRoute(request);

  if (!user?.id) {
    return NextResponse.json(
      { ok: false as const, error: "Sign in required" },
      { status: 401 }
    );
  }

  let supabase;
  try {
    supabase = getSupabaseServiceRoleClient();
  } catch {
    return NextResponse.json(
      { ok: false as const, error: "Server configuration error" },
      { status: 500 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false as const, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const o = body as Record<string, unknown>;
  const input: Parameters<typeof updateProfileSettings>[1] = {
    userId: user.id,
  };
  if (typeof o.isPublicProfile === "boolean") input.isPublicProfile = o.isPublicProfile;
  if (typeof o.allowActivityFeed === "boolean") input.allowActivityFeed = o.allowActivityFeed;
  if (typeof o.allowLeaderboard === "boolean") input.allowLeaderboard = o.allowLeaderboard;

  const result = await updateProfileSettings(supabase, input);

  if (!result.ok) {
    return NextResponse.json(
      { ok: false as const, error: result.error },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true as const });
}
