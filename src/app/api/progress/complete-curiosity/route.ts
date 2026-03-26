import { NextResponse } from "next/server";
import { getUserForApiRoute } from "@/lib/supabase/get-user-for-api-route";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { processCuriosityCompletion } from "@/lib/services/progress/process-curiosity-completion";
import { withApiCors } from "@/lib/network/api-route-cors";
import type { CompleteCuriosityClientPayload } from "@/types/progress";

const MODES = new Set(["read", "listen", "read_listen"] as const);

function isPayload(
  body: unknown
): body is CompleteCuriosityClientPayload {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  return (
    typeof o.topicId === "string" &&
    typeof o.slug === "string" &&
    typeof o.modeUsed === "string" &&
    MODES.has(o.modeUsed as "read") &&
    typeof o.challengeCorrect === "boolean" &&
    typeof o.wasDailyFeature === "boolean" &&
    typeof o.wasRandomSpin === "boolean" &&
    (o.bonusCorrect === undefined || typeof o.bonusCorrect === "boolean")
  );
}

export async function OPTIONS(request: Request) {
  return withApiCors(request, new NextResponse(null, { status: 204 }));
}

/**
 * Authenticated completion: runs the real progress engine (XP, streak, score, history).
 * Thin wrapper — logic lives in processCuriosityCompletion.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return withApiCors(
      request,
      NextResponse.json(
        { ok: false as const, message: "Invalid JSON" },
        { status: 400 }
      )
    );
  }

  if (!isPayload(body)) {
    return withApiCors(
      request,
      NextResponse.json(
        {
          ok: false as const,
          message:
            "Invalid body: topicId, slug, modeUsed, challengeCorrect, wasDailyFeature, wasRandomSpin required",
        },
        { status: 400 }
      )
    );
  }

  try {
    const user = await getUserForApiRoute(request);

    if (!user?.id) {
      return withApiCors(
        request,
        NextResponse.json(
          { ok: false as const, message: "Sign in to save progress." },
          { status: 401 }
        )
      );
    }

    const usedListenMode =
      body.modeUsed === "listen" || body.modeUsed === "read_listen";

    let supabase;
    try {
      supabase = getSupabaseServiceRoleClient();
    } catch {
      return withApiCors(
        request,
        NextResponse.json(
          {
            ok: false as const,
            message:
              "Server missing SUPABASE_SERVICE_ROLE_KEY — add it in Vercel env and redeploy.",
          },
          { status: 503 }
        )
      );
    }

    const result = await processCuriosityCompletion(supabase, {
      userId: user.id,
      topicId: body.topicId.trim(),
      slug: body.slug.trim(),
      completedAt: new Date().toISOString(),
      modeUsed: body.modeUsed,
      lessonCompleted: true,
      challengeAttempted: true,
      challengeCorrect: body.challengeCorrect,
      bonusCorrect: body.bonusCorrect,
      wasDailyFeature: body.wasDailyFeature,
      wasRandomSpin: body.wasRandomSpin,
      usedListenMode,
    });

    if (!result.ok) {
      return withApiCors(request, NextResponse.json(result, { status: 400 }));
    }

    return withApiCors(request, NextResponse.json(result));
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Unexpected error saving progress.";
    return withApiCors(
      request,
      NextResponse.json({ ok: false as const, message }, { status: 500 })
    );
  }
}
