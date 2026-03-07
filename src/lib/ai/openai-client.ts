import OpenAI from "openai";

function createOpenAIClient(): OpenAI | null {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key === "your_openai_api_key_here") {
    return null;
  }
  return new OpenAI({ apiKey: key });
}

export const openai = createOpenAIClient();
