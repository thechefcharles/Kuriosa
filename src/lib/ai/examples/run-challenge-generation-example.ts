/**
 * Example: generate primary + bonus challenges for a topic.
 *
 * Run: npm run ai:challenge
 * Requires OPENAI_API_KEY in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generateChallenge } from "@/lib/ai/generators/generate-challenge";
import { primaryQuizToCuriosityOptions } from "@/types/content-generation";

const octopusLesson = `
Why do octopuses have three hearts? Two branchial hearts pump blood through the gills
to pick up oxygen; the systemic heart pumps oxygenated blood to the rest of the body.
When an octopus swims, the systemic heart actually stops—so crawling is more efficient
for them than jetting long distances.
`.trim();

const lightningLesson = `
Lightning can reach about 30,000°C—hotter than the Sun's surface (~5,500°C) because
the electrical discharge is concentrated in a narrow channel, dumping enormous energy
into a tiny volume for a split second.
`.trim();

async function runOne(title: string, category: string, lesson: string): Promise<void> {
  console.log(`\n========== ${title} ==========\n`);
  const result = await generateChallenge({
    topicTitle: title,
    category,
    lessonSummaryOrContent: lesson,
    difficulty: "beginner",
    desiredChallengeTypes: ["multiple_choice", "memory_recall"],
    audience: "curious adults and teens",
  });

  if (!result.success) {
    console.error("Failed:", result.error);
    if (result.details) console.error(JSON.stringify(result.details, null, 2));
    return;
  }

  const { challenge } = result;
  console.log("Primary:", challenge.primary.quizType);
  console.log(" Q:", challenge.primary.questionText);
  if (challenge.primary.quizType === "memory_recall") {
    console.log(" Correct answer:", challenge.primary.correctAnswer);
  } else {
    console.log(
      " Options:",
      challenge.primary.options.map((o) => `${o.id}) ${o.optionText}`).join(" | ")
    );
    console.log(" Correct:", challenge.primary.correctOptionId);
  }
  console.log(" Explanation:", challenge.primary.explanationText.slice(0, 200) + "…");

  console.log("\nBonus:", challenge.bonus.quizType);
  console.log(" Q:", challenge.bonus.questionText);
  if (challenge.bonus.quizType === "memory_recall") {
    console.log(" Accepted:", challenge.bonus.acceptedAnswers.join(" | "));
  } else {
    console.log(" Correct:", challenge.bonus.correctOptionId);
  }
  console.log(" Explanation:", challenge.bonus.explanationText.slice(0, 180) + "…");

  console.log(
    "\nXP hints — primary:",
    challenge.primaryXpAward,
    "bonus:",
    challenge.bonusXpAward ?? "—"
  );

  if (challenge.primary.quizType !== "memory_recall") {
    const mapped = primaryQuizToCuriosityOptions(challenge.primary);
    console.log(
      "Curiosity-style options (isCorrect flags):",
      mapped.map((o) => (o.isCorrect ? `[✓] ${o.optionText}` : o.optionText)).join(" | ")
    );
  }
}

async function main(): Promise<void> {
  console.log("Kuriosa challenge generation example\n");
  await runOne(
    "Why do octopuses have three hearts?",
    "Science",
    octopusLesson
  );
  await runOne(
    "Why is lightning hotter than the sun?",
    "Science",
    lightningLesson
  );
}

main().catch(console.error);
