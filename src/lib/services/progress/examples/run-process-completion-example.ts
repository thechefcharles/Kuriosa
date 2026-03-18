/**
 * Developer example: run the progress engine with the service-role client.
 *
 * Prerequisites:
 * - Apply migration `20260319130000_phase62_rewards_granted.sql` (rewards_granted column).
 * - `.env.local`: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * - Set env vars below to a real profile id and published topic (id + slug must match).
 *
 * Run: npm run progress:complete-example
 *
 * Warning: mutates profiles + user_topic_history for that user/topic. Use a test account.
 * To test "first grant" again, manually clear or fix that user's row for the topic in Supabase.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { processCuriosityCompletion } from "@/lib/services/progress/process-curiosity-completion";

const USER_ID = process.env.PHASE6_DEMO_USER_ID?.trim();
const TOPIC_ID = process.env.PHASE6_DEMO_TOPIC_ID?.trim();
const SLUG = process.env.PHASE6_DEMO_TOPIC_SLUG?.trim();

async function main(): Promise<void> {
  if (!USER_ID || !TOPIC_ID || !SLUG) {
    console.error(
      "Set PHASE6_DEMO_USER_ID, PHASE6_DEMO_TOPIC_ID, PHASE6_DEMO_TOPIC_SLUG in the environment."
    );
    process.exit(1);
  }

  const supabase = getSupabaseServiceRoleClient();

  const payload = {
    userId: USER_ID,
    topicId: TOPIC_ID,
    slug: SLUG,
    completedAt: new Date().toISOString(),
    modeUsed: "read" as const,
    lessonCompleted: true,
    challengeAttempted: true,
    challengeCorrect: true,
    wasDailyFeature: false,
    wasRandomSpin: false,
    usedListenMode: false,
  };

  console.log("Running processCuriosityCompletion with:", {
    ...payload,
    completedAt: payload.completedAt,
  });

  const result = await processCuriosityCompletion(supabase, payload);

  console.log(JSON.stringify(result, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
