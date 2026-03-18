import OpenAI from "openai";

function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "OpenAI client utilities must only be used server-side. A client-side module attempted to import them."
    );
  }
}

/** Server-side only. Use getOpenAIClient() to fail clearly if key is missing. */
function createOpenAIClient(): OpenAI {
  assertServerOnly();
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === "your_openai_api_key_here") {
    throw new Error(
      "OPENAI_API_KEY is missing or placeholder. Add it to .env.local. AI features will not work."
    );
  }
  return new OpenAI({ apiKey: key });
}

let _client: OpenAI | null = null;

/**
 * Returns a configured OpenAI client. Throws if OPENAI_API_KEY is missing.
 * Use only on the server.
 */
export function getOpenAIClient(): OpenAI {
  if (!_client) {
    _client = createOpenAIClient();
  }
  return _client;
}
