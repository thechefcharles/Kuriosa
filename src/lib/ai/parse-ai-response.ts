/**
 * Phase 9 — Safe parsing of AI responses.
 * Handles JSON arrays and structured text. Guards against malformed output.
 */

export type ParseStringArrayResult =
  | { ok: true; value: string[] }
  | { ok: false; error: string };

/**
 * Parse a response that should be a JSON array of strings.
 * Strips markdown code fences and trims. Returns safe fallback on failure.
 */
export function parseStringArray(raw: string): ParseStringArrayResult {
  let cleaned = raw.trim();
  const codeBlockMatch = cleaned.match(/^```(?:json)?\s*([\s\S]*?)```\s*$/);
  if (codeBlockMatch) {
    cleaned = codeBlockMatch[1].trim();
  }
  try {
    const parsed = JSON.parse(cleaned);
    if (!Array.isArray(parsed)) {
      return { ok: false, error: "Response is not an array" };
    }
    const strings = parsed
      .filter((x): x is string => typeof x === "string")
      .map((s) => String(s).trim())
      .filter((s) => s.length > 0);
    return { ok: true, value: strings };
  } catch {
    return { ok: false, error: "Invalid JSON" };
  }
}

export type ParseTextResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

/**
 * Sanitize plain-text AI response. Strips common artifacts.
 */
export function parseText(raw: string): ParseTextResult {
  let text = raw.trim();
  if (!text) {
    return { ok: false, error: "Empty response" };
  }
  text = text.replace(/^(?:Here'?s?|Answer:)\s*/i, "").trim();
  return { ok: true, value: text };
}
