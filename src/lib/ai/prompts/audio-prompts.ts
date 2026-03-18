/**
 * Prompt builders for listenable audio narration scripts.
 */

import { composeLessonTextFromGenerated } from "@/types/content-generation";
import type {
  GeneratedAudioRequestOptions,
  GeneratedLessonContent,
} from "@/types/content-generation";

const SYSTEM_PROMPT = `You are a Kuriosa audio script writer. You write narration meant to be read aloud (TTS later).

Style:
- Smooth, natural sentences—avoid tongue-twisters and dense lists
- Concise; curiosity-first hook, then clear explanation
- Warm and clear, not robotic or lecture-heavy
- No stage directions in brackets unless essential; no sound-effect cues

Return valid JSON only. No markdown.

The audioScript and transcriptText should be the same spoken words (transcript = captions / accessibility).`;

function lessonBlock(options: GeneratedAudioRequestOptions): string {
  if (options.generatedLesson) {
    const g = options.generatedLesson as GeneratedLessonContent;
    return [
      `Title: ${g.title}`,
      `Hook: ${g.hookText}`,
      `Lesson:\n${composeLessonTextFromGenerated(g)}`,
    ].join("\n");
  }
  if (options.lessonText?.trim()) {
    return options.lessonText.trim();
  }
  return "(No lesson body provided—infer a short accurate script only from the topic title and category.)";
}

function targetGuidance(options: GeneratedAudioRequestOptions): string {
  if (options.targetDurationSeconds != null) {
    const sec = Math.min(480, Math.max(45, options.targetDurationSeconds));
    const approxWords = Math.round((sec / 60) * 150);
    return `Target listening time about ${sec} seconds (aim ~${approxWords} words in audioScript).`;
  }
  if (options.targetWordCount != null) {
    const w = Math.min(900, Math.max(80, options.targetWordCount));
    const sec = Math.round((w / 150) * 60);
    return `Target about ${w} spoken words; duration estimate ~${sec} seconds.`;
  }
  return "Target about 90–150 seconds of audio (~130–200 words).";
}

function buildUserPrompt(input: GeneratedAudioRequestOptions): string {
  const tone = input.tone ?? "warm, curious, conversational";
  const parts: string[] = [
    `Topic title: "${input.topicTitle}"`,
    `Category: ${input.category}.`,
    targetGuidance(input),
    `Tone: ${tone}.`,
  ];
  if (input.difficulty) parts.push(`Difficulty context: ${input.difficulty}.`);
  if (input.audience) parts.push(`Audience: ${input.audience}.`);

  parts.push(`
Source material (stay faithful; do not invent facts beyond this):
---
${lessonBlock(input).slice(0, 14000)}
---
`);

  parts.push(`
Return JSON:
{
  "audio": {
    "titleIntroLine": "Optional one short line before main narration (e.g. welcome to this curiosity)",
    "audioScript": "Main narration only—full sentences, speakable",
    "closingLine": "Optional short sign-off",
    "transcriptText": "Same words as titleIntroLine + audioScript + closingLine combined into one plain transcript (no duplicate paragraphs)",
    "durationSecondsEstimate": integer 40-480,
    "estimatedWordCount": integer matching spoken words in audioScript section (~±10%)",
    "voiceStyleHint": "optional e.g. calm female, friendly narrator"
  }
}

Rules:
- transcriptText must match what is spoken (intro + main + closing if present)
- durationSecondsEstimate and estimatedWordCount must be realistic for the script length`);

  return parts.join("\n");
}

export function buildAudioScriptMessages(
  options: GeneratedAudioRequestOptions
): Array<{ role: "system" | "user"; content: string }> {
  return [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(options) },
  ];
}
