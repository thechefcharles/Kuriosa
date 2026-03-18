/**
 * Verify seeded inventory in Supabase (service role).
 *
 * Run: npm run seed:verify
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { fetchSeedInventorySummary } from "@/lib/content/seeds/seed-verification";

async function main(): Promise<void> {
  const summary = await fetchSeedInventorySummary();
  console.log(JSON.stringify(summary, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

