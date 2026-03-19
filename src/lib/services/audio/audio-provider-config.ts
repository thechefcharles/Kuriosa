/**
 * Light config for server-side narration generation (TTS + upload).
 * Default path is OpenAI; ElevenLabs is optional for the same pipeline.
 */

export type TtsGenerationProvider = "openai" | "elevenlabs";

export const DEFAULT_TTS_GENERATION_PROVIDER: TtsGenerationProvider = "openai";

/** OpenAI TTS voices (docs: https://platform.openai.com/docs/guides/text-to-speech) */
export const OPENAI_TTS_VOICES = [
  "alloy",
  "echo",
  "fable",
  "onyx",
  "nova",
  "shimmer",
] as const;

export type OpenAiTtsVoiceId = (typeof OPENAI_TTS_VOICES)[number];

export type OpenAiTtsModelId = "tts-1" | "tts-1-hd";

/**
 * Effective provider for `generateAudioFromScript`.
 * OpenAI-first: use elevenlabs only when explicitly requested or env says so.
 */
export function resolveGenerationProvider(
  override?: TtsGenerationProvider
): TtsGenerationProvider {
  if (override === "elevenlabs" || override === "openai") return override;
  const env = process.env.AUDIO_GENERATION_PROVIDER?.trim().toLowerCase();
  if (env === "elevenlabs" || env === "11labs") return "elevenlabs";
  return DEFAULT_TTS_GENERATION_PROVIDER;
}
