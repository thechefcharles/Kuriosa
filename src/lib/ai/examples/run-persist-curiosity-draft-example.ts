/**
 * Persist an assembled CuriosityExperience to Supabase (service role).
 *
 * Run: npm run persist:draft
 *
 * Requires:
 * - NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY in .env.local
 * - Migration 20250318120000 applied (memory_recall_hints on quizzes)
 * - Seeded categories (e.g. science)
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getOctopusAssembledCuriosityExperience } from "@/lib/content/fixtures/octopus-assembled-draft";
import { persistCuriosityExperienceDraft } from "@/lib/services/content/persist-curiosity-experience-draft";

async function main(): Promise<void> {
  console.log("Persist CuriosityExperience draft (octopus fixture)\n");

  const experience = getOctopusAssembledCuriosityExperience();
  const result = await persistCuriosityExperienceDraft(experience);

  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log("\n✓ Check Supabase → Table Editor → topics (slug:", result.topicSlug + ")");
  } else {
    console.error("\n✗", result.error);
  }
}

main().catch(console.error);
