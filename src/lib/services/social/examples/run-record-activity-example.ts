/**
 * Developer example: record an activity event and fetch recent events.
 *
 * Run: npm run social:record-activity
 * Requires: PHASE10_DEMO_USER_ID in .env.local (a valid profiles.id)
 *
 * Migration: 20260327120000_phase101_social_profiles.sql
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { recordActivityEvent } from "../record-activity-event";
import { getActivityEvents } from "../get-activity-events";

const DEMO_USER_ID = process.env.PHASE10_DEMO_USER_ID?.trim();

async function main() {
  if (!DEMO_USER_ID) {
    console.error("Set PHASE10_DEMO_USER_ID in .env.local (valid profiles.id)");
    process.exit(1);
  }

  await recordActivityEvent({
    userId: DEMO_USER_ID,
    type: "topic_completed",
    metadata: { slug: "example-topic", source: "manual_test" },
  });

  console.log("Recorded topic_completed event");

  const result = await getActivityEvents({ limit: 5, userId: DEMO_USER_ID });
  if (!result.ok) {
    console.error("getActivityEvents failed:", result.error);
    process.exit(1);
  }

  console.log("Recent events:", JSON.stringify(result.events, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
