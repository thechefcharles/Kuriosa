/**
 * Example: run topic idea generation.
 *
 * Run: npm run ai:topic-ideas
 * Requires OPENAI_API_KEY in .env.local.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { generateTopicIdeas } from "@/lib/ai/generators/generate-topic-ideas";

export async function runTopicIdeaExample(): Promise<void> {
  console.log("Generating topic ideas for category: Science...\n");

  const result = await generateTopicIdeas({
    category: "Science",
    count: 3,
    difficulty: "beginner",
  });

  if (!result.success) {
    console.error("Failed:", result.error);
    if (result.details) {
      console.error("Details:", JSON.stringify(result.details, null, 2));
    }
    return;
  }

  console.log(`Received ${result.ideas.length} ideas:\n`);
  result.ideas.forEach((idea, i) => {
    console.log(`${i + 1}. ${idea.title}`);
    console.log(`   Hook: ${idea.hookQuestion}`);
    console.log(`   Category: ${idea.category}, Difficulty: ${idea.difficultyLevel}`);
    console.log(`   Tags: ${idea.tags.join(", ")}\n`);
  });
}

// Run when executed directly
runTopicIdeaExample().catch(console.error);
