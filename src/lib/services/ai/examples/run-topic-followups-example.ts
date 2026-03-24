/**
 * Example: get or generate topic follow-up questions.
 * Run: npm run ai:topic-followups -- --slug=why-sky-blue
 *
 * Requires: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Migration: 20260325120000_phase91_ai_engine.sql, 20260325120001_phase92_ai_followups_unique.sql
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getTopicFollowups } from "../get-topic-followups";

function parseSlug(): string {
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--slug=")) return a.slice(7).trim() || "why-sky-blue";
    if (a.startsWith("--topicId=")) return a.slice(10).trim();
  }
  return "why-sky-blue";
}

async function main() {
  const slug = parseSlug();
  console.log(`Getting follow-ups for topic: ${slug}\n`);

  const result = await getTopicFollowups({ slug });

  if (!result.ok) {
    console.error("Error:", result.error);
    process.exit(1);
  }

  console.log("Follow-up questions:");
  result.questions.forEach((q, i) => console.log(`  ${i + 1}. ${q}`));
  console.log(`\nFrom storage (ai_followups): ${result.fromStorage}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
