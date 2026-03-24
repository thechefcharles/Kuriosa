/**
 * Phase 9.3 — Manual curiosity question API.
 * Authenticated POST: questionText + topicId or slug → AI answer.
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { answerManualQuestion } from "@/lib/services/ai/answer-manual-question";

const INTERACTION_TYPES = new Set(["guided_followup", "manual", "rabbit_hole"]);

function isManualQuestionBody(
  body: unknown
): body is {
  questionText: string;
  topicId?: string;
  slug?: string;
  interactionType?: string;
} {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  if (typeof o.questionText !== "string" || !o.questionText.trim()) return false;
  const hasTopic = typeof o.topicId === "string" && o.topicId.trim().length > 0;
  const hasSlug = typeof o.slug === "string" && o.slug.trim().length > 0;
  return hasTopic || hasSlug;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false as const, error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (!isManualQuestionBody(body)) {
    return NextResponse.json(
      {
        ok: false as const,
        error: "Invalid body: questionText and (topicId or slug) required",
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
      { ok: false as const, error: "Sign in to ask questions." },
      { status: 401 }
    );
  }

  const rawType = body.interactionType;
  const interactionType =
    typeof rawType === "string" && INTERACTION_TYPES.has(rawType)
      ? (rawType as "guided_followup" | "manual" | "rabbit_hole")
      : "manual";

  const input = {
    userId: user.id,
    questionText: body.questionText.trim(),
    topicId: body.topicId?.trim(),
    slug: body.slug?.trim(),
    interactionType,
  };

  const result = await answerManualQuestion(input);
  return NextResponse.json(result);
}
