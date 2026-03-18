/**
 * Zod schemas for structured audio script generation output.
 */

import { z } from "zod";

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export const generatedAudioScriptSchema = z
  .object({
    audioScript: z.string().trim().min(100).max(5000),
    transcriptText: z.string().trim().min(100).max(5500),
    durationSecondsEstimate: z.number().int().min(40).max(480),
    estimatedWordCount: z.number().int().min(70).max(950),
    titleIntroLine: z.string().trim().min(8).max(220).optional(),
    closingLine: z.string().trim().min(8).max(240).optional(),
    voiceStyleHint: z.string().trim().min(6).max(140).optional(),
  })
  .superRefine((data, ctx) => {
    const mainW = wordCount(data.audioScript);
    if (mainW < 70) {
      ctx.addIssue({
        code: "custom",
        path: ["audioScript"],
        message: "audioScript should be at least ~70 words of main narration.",
      });
    }
    const introW = data.titleIntroLine ? wordCount(data.titleIntroLine) : 0;
    const closeW = data.closingLine ? wordCount(data.closingLine) : 0;
    const expectedParts = introW + mainW + closeW;
    const tw = wordCount(data.transcriptText);
    if (Math.abs(tw - expectedParts) > Math.max(20, expectedParts * 0.15)) {
      ctx.addIssue({
        code: "custom",
        path: ["transcriptText"],
        message:
          "transcriptText word count should match titleIntroLine + audioScript + closingLine (combined spoken text).",
      });
    }
    const wpm = tw / (data.durationSecondsEstimate / 60);
    if (wpm < 95 || wpm > 210) {
      ctx.addIssue({
        code: "custom",
        path: ["durationSecondsEstimate"],
        message:
          "durationSecondsEstimate should imply ~95–210 spoken words/min for full transcript.",
      });
    }
    if (
      data.estimatedWordCount < tw * 0.88 ||
      data.estimatedWordCount > tw * 1.12
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["estimatedWordCount"],
        message: "estimatedWordCount should match full transcript (~±12%).",
      });
    }
  });

export const generatedAudioContentSchema = z.object({
  audio: generatedAudioScriptSchema,
});

export type GeneratedAudioScriptInferred = z.infer<
  typeof generatedAudioScriptSchema
>;
