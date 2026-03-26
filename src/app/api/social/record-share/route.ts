/**
 * Phase 10.2 — Record share event (non-blocking analytics).
 * POST: topicId, channel → records topic_shared when user is signed in.
 */

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";
import { recordShareEvent } from "@/lib/services/social/record-share-event";
import type { ShareChannel } from "@/lib/services/social/record-share-event";

const CHANNELS = new Set<ShareChannel>(["copy_link", "native_share", "external_unknown"]);

function isRecordShareBody(
  body: unknown
): body is { topicId: string; channel: string } {
  if (!body || typeof body !== "object") return false;
  const o = body as Record<string, unknown>;
  return (
    typeof o.topicId === "string" &&
    o.topicId.trim().length > 0 &&
    typeof o.channel === "string" &&
    CHANNELS.has(o.channel as ShareChannel)
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!isRecordShareBody(body)) {
    return NextResponse.json(
      { ok: false, error: "topicId and channel (copy_link|native_share|external_unknown) required" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  recordShareEvent({
    userId: user?.id ?? null,
    topicId: body.topicId.trim(),
    channel: body.channel as ShareChannel,
  }).catch(() => {});

  return NextResponse.json({ ok: true });
}
