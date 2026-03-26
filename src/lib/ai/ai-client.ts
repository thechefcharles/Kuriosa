/**
 * Phase 9 — Centralized AI request utility.
 * Wraps OpenAI calls. All AI requests should go through this layer.
 * Server-side only.
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";

export type AICompletionOptions = {
  /** System message (optional) */
  system?: string;
  /** Model override; defaults to gpt-4o-mini for cost control */
  model?: string;
  /** Temperature 0–1; lower = more deterministic */
  temperature?: number;
  /** Max tokens in response */
  maxTokens?: number;
};

const DEFAULT_MODEL = "gpt-4o-mini";
const DEFAULT_TEMPERATURE = 0.6;
const DEFAULT_MAX_TOKENS = 1024;

export type AICompletionResult =
  | { ok: true; text: string; model: string; usage?: { promptTokens?: number; completionTokens?: number } }
  | { ok: false; error: string };

/**
 * Run a completion and return raw text. Caller parses as needed.
 */
export async function runAICompletion(
  userPrompt: string,
  options: AICompletionOptions = {}
): Promise<AICompletionResult> {
  if (typeof window !== "undefined") {
    return { ok: false, error: "AI client must run server-side only." };
  }

  try {
    const client = getOpenAIClient();
    const model = options.model ?? DEFAULT_MODEL;
    const temperature = options.temperature ?? DEFAULT_TEMPERATURE;
    const maxTokens = options.maxTokens ?? DEFAULT_MAX_TOKENS;

    const messages: { role: "system" | "user"; content: string }[] = [];
    if (options.system) {
      messages.push({ role: "system", content: options.system });
    }
    messages.push({ role: "user", content: userPrompt });

    const completion = await Promise.race([
      client.chat.completions.create({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("AI request timed out")), 30_000)
      ),
    ]);

    const text = completion.choices[0]?.message?.content;
    if (!text || typeof text !== "string") {
      return {
        ok: false,
        error: "Empty or invalid API response",
      };
    }

    return {
      ok: true,
      text: text.trim(),
      model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
          }
        : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (process.env.NODE_ENV === "development") {
      console.warn("[AI client]", message);
    }
    return {
      ok: false,
      error: message,
    };
  }
}
