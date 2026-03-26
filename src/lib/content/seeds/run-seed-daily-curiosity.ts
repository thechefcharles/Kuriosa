/**
 * Seed today's daily_curiosity row (same logic as Vercel Cron roll).
 * Run: npm run seed:daily
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Prerequisite: at least one published topic exists.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { rollDailyCuriosity } from "@/lib/services/content/roll-daily-curiosity";

async function main(): Promise<void> {
  console.log("Rolling daily_curiosity for today (UTC)...\n");

  const supabase = getSupabaseServiceRoleClient();
  const result = await rollDailyCuriosity(supabase);

  if (!result.ok) {
    console.error(result.message);
    process.exit(1);
  }

  console.log(`✓ daily_curiosity set for ${result.date}`);
  console.log(`  Topic: ${result.title} (${result.slug})`);
  console.log("\nHome page will now show today's curiosity.");
  console.log(
    "\nTip: production uses Vercel Cron at midnight UTC (see vercel.json + ENVIRONMENT_SETUP.md)."
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
