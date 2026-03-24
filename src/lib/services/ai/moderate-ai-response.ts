/**
 * Phase 9 — Basic moderation for AI responses.
 * Uses OpenAI Moderation API. Returns isSafe.
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";

export type ModerationResult =
  | { ok: true; isSafe: boolean }
  | { ok: false; error: string };

/**
 * Check text for unsafe categories via OpenAI Moderation.
 * If moderation fails (e.g. API error), returns isSafe: false for safety.
 */
export async function moderateAIResponse(text: string): Promise<ModerationResult> {
  if (typeof window !== "undefined") {
    return { ok: false, error: "Moderation must run server-side only." };
  }

  const trimmed = String(text).trim();
  if (!trimmed) {
    return { ok: true, isSafe: true };
  }

  try {
    const client = getOpenAIClient();
    const result = await client.moderations.create({ input: trimmed });
    const first = result.results?.[0];
    if (!first) {
      return { ok: true, isSafe: true };
    }
    const isSafe = !first.flagged;
    return { ok: true, isSafe };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV === "development") {
      console.warn("[Moderation]", message);
    }
    return { ok: false, error: message };
  }
}
