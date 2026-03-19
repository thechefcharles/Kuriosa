/**
 * Example: run lesson generation for a realistic topic.
 *
 * Run: npm run ai:lesson
 * Requires OPENAI_API_KEY in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generateLesson } from "@/lib/ai/generators/generate-lesson";
import { composeLessonTextFromGenerated } from "@/types/content-generation";

async function runExample(title: string, category: string): Promise<void> {
  console.log(`\n--- Lesson: ${title} ---\n`);
  const result = await generateLesson({
    topicTitle: title,
    category,
    targetWordCount: 200,
    difficulty: "beginner",
    hookContext: title,
  });

  if (!result.success) {
    console.error("Failed:", result.error);
    if (result.details) {
      console.error("Details:", JSON.stringify(result.details, null, 2));
    }
    return;
  }

  const { lesson } = result;
  console.log("Title:", lesson.title);
  console.log("Hook:", lesson.hookText);
  console.log("Summary:", lesson.shortSummary);
  console.log("Difficulty:", lesson.difficultyLevel, "| Minutes:", lesson.estimatedMinutes);
  console.log("Tags:", lesson.tags.join(", "));
  console.log("XP:", lesson.xpAward, lesson.levelHint != null ? `| Level hint: ${lesson.levelHint}` : "");
  console.log("\nSurprising fact:", lesson.surprisingFact);
  console.log("\nReal world:", lesson.realWorldRelevance);
  console.log("\n--- Intro ---\n", lesson.intro.slice(0, 400) + (lesson.intro.length > 400 ? "…" : ""));
  console.log("\n--- Body (start) ---\n", lesson.body.slice(0, 500) + (lesson.body.length > 500 ? "…" : ""));
  console.log(
    "\n--- Composed lessonText length (chars) ---",
    composeLessonTextFromGenerated(lesson).length
  );
}

async function main(): Promise<void> {
  console.log("Kuriosa lesson generation example\n");
  await runExample("Why do octopuses have three hearts?", "Science");
  await runExample("Why is lightning hotter than the sun?", "Science");
}

main().catch(console.error);
