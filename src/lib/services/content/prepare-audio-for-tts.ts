/**
 * Normalize generated audio script for future TTS. No API calls.
 */

import type { GeneratedAudioScript } from "@/types/content-generation";

export interface PreparedAudioForTts {
  /** Single string to pass to a TTS provider later */
  ttsPlainText: string;
  /** Same as model transcript (captions / CuriosityAudio.transcript) */
  transcriptPlain: string;
  /** Suggested duration for QA (from model estimate) */
  durationSecondsEstimate: number;
}

function joinSpokenParts(script: GeneratedAudioScript): string {
  const chunks: string[] = [];
  if (script.titleIntroLine?.trim()) {
    chunks.push(script.titleIntroLine.trim());
  }
  chunks.push(script.audioScript.trim());
  if (script.closingLine?.trim()) {
    chunks.push(script.closingLine.trim());
  }
  return chunks.join("\n\n");
}

/**
 * Prefer model transcript when consistent; otherwise build from segments.
 */
export function prepareAudioForTts(script: GeneratedAudioScript): PreparedAudioForTts {
  const fromParts = joinSpokenParts(script);
  const transcript = script.transcriptText.trim();
  const ttsPlainText =
    transcript.length >= fromParts.length * 0.9 ? transcript : fromParts;

  return {
    ttsPlainText: ttsPlainText.replace(/\s+/g, " ").replace(/\n{3,}/g, "\n\n").trim(),
    transcriptPlain: transcript,
    durationSecondsEstimate: script.durationSecondsEstimate,
  };
}
