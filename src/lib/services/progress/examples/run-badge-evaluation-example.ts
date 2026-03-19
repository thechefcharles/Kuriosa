/**
 * Evaluate badge eligibility for a user (read-only + optional unlock dry-run).
 *
 * Run: npm run progress:badges-example
 *
 * Env: PHASE6_DEMO_USER_ID (profile / auth user uuid)
 *      Set PHASE6_BADGE_UNLOCK=1 to persist newly eligible badges (service role).
 *
 * Requires: badges seeded, user_topic_history with rewards_granted rows for meaningful counts.
 * Uses SUPABASE_SERVICE_ROLE_KEY (bypasses RLS) when unlocking; read-only path uses same client.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { evaluateBadgeEligibility } from "@/lib/services/progress/evaluate-badge-eligibility";
import { unlockBadges } from "@/lib/services/progress/unlock-badges";

const USER_ID = process.env.PHASE6_DEMO_USER_ID?.trim();
const DO_UNLOCK = process.env.PHASE6_BADGE_UNLOCK === "1";

async function main(): Promise<void> {
  if (!USER_ID) {
    console.error("Set PHASE6_DEMO_USER_ID to a real auth user id (profiles.id).");
    process.exit(1);
  }

  const supabase = getSupabaseServiceRoleClient();

  const result = await evaluateBadgeEligibility(supabase, USER_ID);

  if ("error" in result) {
    console.error("Evaluation failed:", result.error);
    process.exit(1);
  }

  console.log("Already unlocked slugs:", result.alreadyUnlockedSlugs);
  console.log(
    "Newly eligible (not yet in user_badges):",
    result.newlyEligible.map((b) => ({
      slug: b.slug,
      name: b.name,
      criteria_type: b.criteria_type,
      criteria_value: b.criteria_value,
    }))
  );

  if (DO_UNLOCK && result.newlyEligible.length) {
    const u = await unlockBadges(supabase, USER_ID, result.newlyEligible);
    if (!u.ok) {
      console.error("Unlock failed:", u.message);
      process.exit(1);
    }
    console.log(
      "Persisted unlocks:",
      u.newlyUnlocked.map((x) => x.slug)
    );
  } else if (result.newlyEligible.length && !DO_UNLOCK) {
    console.log(
      "\n(To insert user_badges rows, run: PHASE6_BADGE_UNLOCK=1 npm run progress:badges-example)"
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
