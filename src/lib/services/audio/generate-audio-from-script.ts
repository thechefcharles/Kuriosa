/**
 * Server-only: TTS from script → Supabase Storage. Does not write DB; use saveGeneratedAudioMetadata after.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { uploadCuriosityAudio } from "@/lib/services/audio/upload-audio";
import {
  OPENAI_TTS_MAX_CHARS,
  synthesizeOpenAiSpeechToMp3,
} from "@/lib/services/audio/tts/openai-tts";
import { synthesizeElevenLabsSpeechToMp3 } from "@/lib/services/audio/tts/elevenlabs-tts";
import { estimateDurationSecondsFromMp3Bytes } from "@/lib/services/audio/tts/synthesize-narration";
import {
  resolveGenerationProvider,
  type OpenAiTtsModelId,
  type OpenAiTtsVoiceId,
  type TtsGenerationProvider,
} from "@/lib/services/audio/audio-provider-config";

export type GenerateAudioFromScriptInput = {
  /** topics.id — used as Storage object key */
  topicId: string;
  /** Narration plain text (trimmed; OpenAI max ~4096 chars applied in synthesizer) */
  scriptText: string;
  provider?: TtsGenerationProvider;
  /** OpenAI only */
  openAiVoice?: OpenAiTtsVoiceId;
  openAiModel?: OpenAiTtsModelId;
};

export type GenerateAudioFromScriptSuccess = {
  ok: true;
  audioUrl: string;
  storagePath: string;
  durationSeconds: number | null;
  /** Text actually sent to TTS (after any truncation) */
  transcriptUsed: string;
  provider: TtsGenerationProvider;
};

export type GenerateAudioFromScriptResult =
  | GenerateAudioFromScriptSuccess
  | { ok: false; error: string };

async function synthesizeMp3(
  text: string,
  provider: TtsGenerationProvider,
  openAiVoice?: OpenAiTtsVoiceId,
  openAiModel?: OpenAiTtsModelId
): Promise<{ buffer: Buffer; transcriptUsed: string }> {
  const trimmed = text.replace(/\s+/g, " ").trim();

  if (provider === "elevenlabs") {
    const buffer = await synthesizeElevenLabsSpeechToMp3(trimmed);
    const used =
      trimmed.length > 8000
        ? `${trimmed.slice(0, 7970)}\n\n[Trimmed.]`
        : trimmed;
    return { buffer, transcriptUsed: used };
  }

  const buffer = await synthesizeOpenAiSpeechToMp3(trimmed, {
    voice: openAiVoice,
    model: openAiModel,
  });
  const transcriptUsed =
    trimmed.length > OPENAI_TTS_MAX_CHARS
      ? `${trimmed.slice(0, OPENAI_TTS_MAX_CHARS - 20)}\n\n[Trimmed for length.]`
      : trimmed;
  return { buffer, transcriptUsed };
}

export async function generateAudioFromScript(
  supabase: SupabaseClient,
  input: GenerateAudioFromScriptInput
): Promise<GenerateAudioFromScriptResult> {
  if (typeof window !== "undefined") {
    return { ok: false, error: "generateAudioFromScript is server-only" };
  }

  const topicId = input.topicId.trim();
  if (!topicId) return { ok: false, error: "topicId is required" };

  const script = input.scriptText?.replace(/\s+/g, " ").trim() ?? "";
  if (!script) return { ok: false, error: "scriptText is empty" };

  const provider = resolveGenerationProvider(input.provider);

  try {
    const { buffer, transcriptUsed } = await synthesizeMp3(
      script,
      provider,
      input.openAiVoice,
      input.openAiModel
    );

    const blob = new Blob([new Uint8Array(buffer)], { type: "audio/mpeg" });
    const up = await uploadCuriosityAudio(supabase, {
      file: blob,
      topicId,
      extension: "mp3",
    });

    if (!up.ok) return { ok: false, error: up.error };

    const durationSeconds = estimateDurationSecondsFromMp3Bytes(buffer.length);

    return {
      ok: true,
      audioUrl: up.publicUrl,
      storagePath: up.storagePath,
      durationSeconds,
      transcriptUsed,
      provider,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
