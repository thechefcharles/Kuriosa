/**
 * Example: generate follow-up questions for a topic.
 * Run: npx tsx src/lib/services/ai/examples/run-generate-followups-example.ts
 *
 * Requires: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generateFollowups } from "../generate-followups";

async function main() {
  const result = await generateFollowups({
    topicId: "00000000-0000-0000-0000-000000000000",
    topicTitle: "Why is the sky blue?",
    lessonExcerpt:
      "Sunlight contains every color. Blue light scatters more in the atmosphere, so we see blue overhead.",
  });

  if (!result.ok) {
    console.error("Error:", result.error);
    process.exit(1);
  }

  console.log("Follow-up questions:", result.questions);
  console.log("From cache:", result.fromCache);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
