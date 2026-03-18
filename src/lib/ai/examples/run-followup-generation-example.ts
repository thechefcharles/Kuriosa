/**
 * Example: generate suggested follow-ups for a topic.
 *
 * Run: npm run ai:followups
 * Requires OPENAI_API_KEY in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generateFollowups } from "@/lib/ai/generators/generate-followups";
import { followupItemToCuriosityFields } from "@/types/content-generation";

const octopusLesson = `
Octopuses have three hearts: two pump blood to the gills, one pumps to the body.
When swimming fast, the systemic heart pauses—crawling costs less oxygen than jetting.
`.trim();

const lightningLesson = `
A lightning bolt's channel can reach ~30,000°C—far hotter than the Sun's surface—because
energy is dumped into a very thin path for microseconds.
`.trim();

async function runOne(
  title: string,
  category: string,
  lesson: string,
  count: number
): Promise<void> {
  console.log(`\n========== ${title} (${count} follow-ups) ==========\n`);
  const result = await generateFollowups({
    topicTitle: title,
    category,
    lessonSummaryOrContent: lesson,
    desiredCount: count,
    difficulty: "beginner",
    audience: "curious general audience",
    tags: ["science", "wonder"],
  });

  if (!result.success) {
    console.error("Failed:", result.error);
    if (result.details) console.error(JSON.stringify(result.details, null, 2));
    return;
  }

  for (const item of result.content.followups.sort(
    (a, b) => a.sortOrder - b.sortOrder
  )) {
    console.log(`\n[${item.sortOrder}] (${item.difficultyLevel}) ${item.questionText}`);
    console.log(`    A: ${item.answerSnippet.slice(0, 200)}${item.answerSnippet.length > 200 ? "…" : ""}`);
    if (item.rationale) console.log(`    Why: ${item.rationale}`);
    if (item.tagHints?.length) console.log(`    Tags: ${item.tagHints.join(", ")}`);
    const mapped = followupItemToCuriosityFields(item);
    console.log(`    → Curiosity fields: Q + answerText (${mapped.answerText.length} chars)`);
  }
}

async function main(): Promise<void> {
  console.log("Kuriosa follow-up generation example\n");
  await runOne("Why do octopuses have three hearts?", "Science", octopusLesson, 4);
  await runOne("Why is lightning hotter than the sun?", "Science", lightningLesson, 3);
}

main().catch(console.error);
