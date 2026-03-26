/**
 * Example: run leaderboard queries.
 *
 * Run: npm run social:leaderboard-example
 * Requires Supabase env vars in .env.local.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getLeaderboard } from "@/lib/services/social/get-leaderboard";
import { getUserLeaderboardPosition } from "@/lib/services/social/get-user-leaderboard-position";

async function runLeaderboardExample(): Promise<void> {
  console.log("=== Kuriosa Leaderboard Example ===\n");

  for (const window of ["weekly", "monthly", "all_time"] as const) {
    console.log(`--- ${window.toUpperCase()} ---`);
    const result = await getLeaderboard(window, { limit: 5 });
    console.log(`Total eligible: ${result.totalEligible}`);
    console.log(`Window: ${result.windowStart ?? "N/A"} → ${result.windowEnd ?? "N/A"}`);
    result.entries.forEach((e) => {
      console.log(
        `  #${e.rank} ${e.displayName ?? e.userId.slice(0, 8)} — score: ${e.score}`
      );
    });
    console.log("");
  }

  const testUserId = process.env.TEST_USER_ID?.trim();
  if (testUserId) {
    console.log(`--- User position (${testUserId.slice(0, 8)}...) ---`);
    const pos = await getUserLeaderboardPosition("weekly", {
      currentUserId: testUserId,
    });
    if (pos) {
      console.log(`Rank: #${pos.rank} / ${pos.totalEligible}, score: ${pos.score}`);
    } else {
      console.log("Not eligible or no rankable data.");
    }
  } else {
    console.log("Set TEST_USER_ID in .env.local to test user position lookup.");
  }
}

runLeaderboardExample().catch(console.error);
