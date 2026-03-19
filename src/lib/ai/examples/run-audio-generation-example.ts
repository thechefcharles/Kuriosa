/**
 * Example: generate audio narration scripts.
 *
 * Run: npm run ai:audio
 * Requires OPENAI_API_KEY in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generateAudioScript } from "@/lib/ai/generators/generate-audio-script";
import { generatedAudioToCuriosityFields } from "@/types/content-generation";
import { prepareAudioForTts } from "@/lib/services/content/prepare-audio-for-tts";

const octopusLesson = `
Octopuses have three hearts. Two pump blood through the gills; one pumps to the rest of the body.
Their blood is blue from copper-based hemocyanin. When they swim hard, the systemic heart can pause.
`.trim();

async function runOne(
  title: string,
  category: string,
  lesson: string,
  seconds: number
): Promise<void> {
  console.log(`\n========== Audio script: ${title} ==========\n`);
  const result = await generateAudioScript({
    topicTitle: title,
    category,
    lessonText: lesson,
    targetDurationSeconds: seconds,
    audience: "curious listeners",
    tone: "warm, clear, slightly playful",
  });

  if (!result.success) {
    console.error("Failed:", result.error);
    if (result.details) console.error(JSON.stringify(result.details, null, 2));
    return;
  }

  const { audio } = result.content;
  console.log("Intro:", audio.titleIntroLine ?? "(none)");
  console.log("\n--- Main script (excerpt) ---\n", audio.audioScript.slice(0, 400) + "…");
  console.log("\nClosing:", audio.closingLine ?? "(none)");
  console.log(
    "\nMeta — ~words:",
    audio.estimatedWordCount,
    "| ~duration s:",
    audio.durationSecondsEstimate,
    "| voice:",
    audio.voiceStyleHint ?? "—"
  );
  const cx = generatedAudioToCuriosityFields(audio);
  console.log("\nCuriosityAudio-ready:", {
    transcriptLen: cx.transcript.length,
    durationSeconds: cx.durationSeconds,
  });
  const tts = prepareAudioForTts(audio);
  console.log("\nTTS prep length (chars):", tts.ttsPlainText.length);
}

async function main(): Promise<void> {
  console.log("Kuriosa audio script generation example\n");
  await runOne("Why do octopuses have three hearts?", "Science", octopusLesson, 100);
  await runOne(
    "Why is lightning hotter than the sun?",
    "Science",
    "Lightning channels reach extreme heat in a thin path for a tiny fraction of a second—far hotter than the Sun's surface in that instant.",
    85
  );
}

main().catch(console.error);
