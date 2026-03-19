import { isValidAudioUrl } from "@/lib/audio/is-valid-audio-url";

export type NormalizedAudioData = {
  /** Canonical playback URL, or null if missing/invalid */
  audioUrl: string | null;
  durationSeconds: number | null;
  /** Dedicated script, else lesson text when URL is valid (captions / consistency) */
  transcript: string | null;
  /** True when Listen Mode should be offered */
  isListenReady: boolean;
};

export type RawTopicAudioInput = {
  audio_url: string | null | undefined;
  audio_script?: string | null | undefined;
  audio_duration_seconds?: number | null | undefined;
  lesson_text?: string | null | undefined;
};

function normalizeDuration(raw: number | null | undefined): number | null {
  if (raw == null) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return null;
  return Math.min(Math.round(n), 86400 * 10);
}

/**
 * Pure normalization for topic audio fields. Safe on any input; never throws.
 */
export function getNormalizedAudioData(raw: RawTopicAudioInput): NormalizedAudioData {
  const urlRaw =
    raw.audio_url != null && typeof raw.audio_url === "string"
      ? raw.audio_url.trim()
      : "";
  const validUrl = urlRaw.length > 0 && isValidAudioUrl(urlRaw);

  const script =
    raw.audio_script != null && String(raw.audio_script).trim().length > 0
      ? String(raw.audio_script).trim()
      : "";
  const lesson =
    raw.lesson_text != null && String(raw.lesson_text).trim().length > 0
      ? String(raw.lesson_text).trim()
      : "";

  const transcript =
    validUrl && script.length > 0
      ? script
      : validUrl && lesson.length > 0
        ? lesson
        : null;

  return {
    audioUrl: validUrl ? urlRaw : null,
    durationSeconds: validUrl ? normalizeDuration(raw.audio_duration_seconds ?? null) : null,
    transcript,
    isListenReady: validUrl,
  };
}
