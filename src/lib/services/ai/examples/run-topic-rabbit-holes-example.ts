/**
 * Example: get or generate rabbit-hole suggestions for a topic.
 * Run: npm run ai:rabbit-holes -- --slug=why-sky-blue
 *      npm run ai:rabbit-holes -- --slug=why-sky-blue --question="Why is Mars sky different?"
 *
 * Requires: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Migration: 20260325120000_phase91_ai_engine.sql
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getTopicRabbitHoles } from "../get-topic-rabbit-holes";

function parseArgs(): { slug: string; question: string | null } {
  let slug = "why-sky-blue";
  let question: string | null = null;
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--slug=")) slug = a.slice(7).trim() || slug;
    if (a.startsWith("--question=")) question = a.slice(11).trim() || null;
  }
  return { slug, question };
}

async function main() {
  const { slug, question } = parseArgs();
  console.log(`Getting rabbit holes for topic: ${slug}`);
  if (question) console.log(`  Question: ${question}`);
  console.log();

  const result = await getTopicRabbitHoles(
    { slug },
    { questionText: question }
  );

  if (!result.ok) {
    console.error("Error:", result.error);
    process.exit(1);
  }

  console.log("Rabbit-hole suggestions:");
  result.suggestions.forEach((s, i) =>
    console.log(`  ${i + 1}. ${s.title}${s.reasonText ? ` — ${s.reasonText}` : ""}`)
  );
  console.log(`\nFrom cache: ${result.fromCache}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
