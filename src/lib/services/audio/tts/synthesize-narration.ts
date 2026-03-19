/**
 * Single entry for narration TTS — OpenAI or ElevenLabs via env.
 */

import { synthesizeOpenAiSpeechToMp3 } from "@/lib/services/audio/tts/openai-tts";
import { synthesizeElevenLabsSpeechToMp3 } from "@/lib/services/audio/tts/elevenlabs-tts";

export type TtsProvider = "openai" | "elevenlabs";

export function getTtsProvider(): TtsProvider {
  const p = process.env.TTS_PROVIDER?.trim().toLowerCase();
  if (p === "elevenlabs" || p === "11labs") return "elevenlabs";
  return "openai";
}

export async function synthesizeNarrationToMp3(text: string): Promise<Buffer> {
  const provider = getTtsProvider();
  if (provider === "elevenlabs") {
    return synthesizeElevenLabsSpeechToMp3(text);
  }
  return synthesizeOpenAiSpeechToMp3(text);
}

/** Rough duration from byte size (MP3 ~128kbps heuristic) for DB hint */
export function estimateDurationSecondsFromMp3Bytes(bytes: number): number {
  if (bytes <= 0) return 0;
  const seconds = (bytes * 8) / 128_000;
  return Math.max(1, Math.round(Math.min(seconds, 3600)));
}
