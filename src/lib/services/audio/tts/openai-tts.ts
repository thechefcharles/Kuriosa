/**
 * OpenAI Text-to-Speech → MP3 bytes. Server-only.
 * @see https://platform.openai.com/docs/guides/text-to-speech
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";

/** OpenAI hard cap per request */
export const OPENAI_TTS_MAX_CHARS = 4096;

export type OpenAiTtsVoice =
  | "alloy"
  | "echo"
  | "fable"
  | "onyx"
  | "nova"
  | "shimmer";

export async function synthesizeOpenAiSpeechToMp3(
  text: string,
  options?: {
    voice?: OpenAiTtsVoice;
    model?: "tts-1" | "tts-1-hd";
  }
): Promise<Buffer> {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) {
    throw new Error("OpenAI TTS: empty text");
  }
  const input =
    trimmed.length > OPENAI_TTS_MAX_CHARS
      ? `${trimmed.slice(0, OPENAI_TTS_MAX_CHARS - 20)}\n\n[Trimmed for length.]`
      : trimmed;

  if (trimmed.length > OPENAI_TTS_MAX_CHARS) {
    console.warn(
      `[OpenAI TTS] Text truncated from ${trimmed.length} to ~${OPENAI_TTS_MAX_CHARS} chars (API limit).`
    );
  }

  const envModel = process.env.OPENAI_TTS_MODEL;
  const model: "tts-1" | "tts-1-hd" =
    options?.model ??
    (envModel === "tts-1-hd" || envModel === "tts-1" ? envModel : "tts-1");

  const envVoice = process.env.OPENAI_TTS_VOICE as OpenAiTtsVoice | undefined;
  const voice: OpenAiTtsVoice =
    options?.voice ??
    (envVoice &&
    ["alloy", "echo", "fable", "onyx", "nova", "shimmer"].includes(envVoice)
      ? envVoice
      : "alloy");

  const openai = getOpenAIClient();
  const response = await openai.audio.speech.create({
    model,
    voice,
    input,
  });

  const ab = await response.arrayBuffer();
  return Buffer.from(ab);
}
