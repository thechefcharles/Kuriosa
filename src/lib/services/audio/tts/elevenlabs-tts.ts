/**
 * ElevenLabs Text-to-Speech → MP3 bytes. Server-only (uses ELEVENLABS_API_KEY).
 * @see https://elevenlabs.io/docs/api-reference/text-to-speech
 */

const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

/** Conservative cap; paid tiers allow more per request */
export const ELEVENLABS_TTS_MAX_CHARS = 8000;

export async function synthesizeElevenLabsSpeechToMp3(
  text: string,
  options?: { voiceId?: string; modelId?: string }
): Promise<Buffer> {
  const key = process.env.ELEVENLABS_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "ELEVENLABS_API_KEY is missing. Add it to .env.local or use TTS_PROVIDER=openai."
    );
  }
  const voiceId =
    options?.voiceId?.trim() ||
    process.env.ELEVENLABS_VOICE_ID?.trim() ||
    "";
  if (!voiceId) {
    throw new Error(
      "Set ELEVENLABS_VOICE_ID (ElevenLabs voice ID from their dashboard)."
    );
  }

  const trimmed = text.replace(/\s+/g, " ").trim();
  if (!trimmed) throw new Error("ElevenLabs TTS: empty text");

  const input =
    trimmed.length > ELEVENLABS_TTS_MAX_CHARS
      ? `${trimmed.slice(0, ELEVENLABS_TTS_MAX_CHARS - 30)}\n\n[Trimmed.]`
      : trimmed;

  if (trimmed.length > ELEVENLABS_TTS_MAX_CHARS) {
    console.warn(
      `[ElevenLabs TTS] Truncated from ${trimmed.length} to ${ELEVENLABS_TTS_MAX_CHARS} chars.`
    );
  }

  const modelId =
    options?.modelId ||
    process.env.ELEVENLABS_MODEL?.trim() ||
    "eleven_multilingual_v2";

  const res = await fetch(`${ELEVENLABS_URL}/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": key,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({
      text: input,
      model_id: modelId,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`ElevenLabs TTS failed (${res.status}): ${err.slice(0, 500)}`);
  }

  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}
