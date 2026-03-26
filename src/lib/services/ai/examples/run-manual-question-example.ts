/**
 * Example: manual curiosity question → AI answer.
 * Run: npm run ai:manual-question -- --slug=why-sky-blue --question="Why does the sky change color at sunset?"
 *
 * Requires: OPENAI_API_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Migrations: 20260325120000_phase91_ai_engine.sql
 *
 * For persistence to ai_questions/ai_answers, set DEMO_USER_ID to a valid profiles.id.
 * Example: DEMO_USER_ID=$(psql -t -c "SELECT id FROM profiles LIMIT 1") npm run ai:manual-question -- ...
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { answerManualQuestion } from "../answer-manual-question";

const DEMO_USER_ID = process.env.DEMO_USER_ID ?? "00000000-0000-0000-0000-000000000001";

function parseArgs(): { slug: string; question: string } {
  let slug = "why-sky-blue";
  let question = "Why does the sky change color at sunset?";
  for (const a of process.argv.slice(2)) {
    if (a.startsWith("--slug=")) slug = a.slice(7).trim() || slug;
    if (a.startsWith("--question=")) question = a.slice(11).trim() || question;
  }
  return { slug, question };
}

async function main() {
  const { slug, question } = parseArgs();
  console.log(`Topic slug: ${slug}`);
  console.log(`Question: ${question}`);
  console.log(`UserId (demo): ${DEMO_USER_ID}\n`);

  const result = await answerManualQuestion({
    userId: DEMO_USER_ID,
    slug,
    questionText: question,
  });

  if (!result.ok) {
    console.error("Error:", result.error);
    console.log("rateLimited:", result.rateLimited);
    console.log("fallbackUsed:", result.fallbackUsed);
    process.exit(1);
  }

  console.log("Normalized question:", result.question);
  console.log("From cache:", result.fromCache);
  console.log("Moderated:", result.moderated);
  console.log("Fallback used:", result.fallbackUsed);
  if (result.questionId) console.log("Question ID:", result.questionId);
  if (result.answerId) console.log("Answer ID:", result.answerId);
  console.log("\nAnswer:\n", result.answerText);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
