import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { processCuriosityCompletion } from "@/lib/services/progress/process-curiosity-completion";
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
    typeof o.wasRandomSpin === "boolean"
  );
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
    return NextResponse.json(
      { ok: false as const, message: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (!isPayload(body)) {
    return NextResponse.json(
      {
        ok: false as const,
        message:
          "Invalid body: topicId, slug, modeUsed, challengeCorrect, wasDailyFeature, wasRandomSpin required",
      },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return NextResponse.json(
      { ok: false as const, message: "Sign in to save progress." },
      { status: 401 }
    );
  }

  const usedListenMode =
    body.modeUsed === "listen" || body.modeUsed === "read_listen";

  const result = await processCuriosityCompletion(supabase, {
    userId: user.id,
    topicId: body.topicId.trim(),
    slug: body.slug.trim(),
    completedAt: new Date().toISOString(),
    modeUsed: body.modeUsed,
    lessonCompleted: true,
    challengeAttempted: true,
    challengeCorrect: body.challengeCorrect,
    wasDailyFeature: body.wasDailyFeature,
    wasRandomSpin: body.wasRandomSpin,
    usedListenMode,
  });

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 });
  }

  return NextResponse.json(result);
}
