/**
 * Phase 4 seeding runner: curated topics → generate → assemble → validate → persist.
 *
 * Run: npm run seed:phase4
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { PHASE_4_SEED_TOPICS } from "@/lib/content/seeds/phase-4-seed-topics";
import { runSeedTopic, type SeedSingleResult } from "@/lib/content/seeds/seed-topic-runner";

export interface Phase4SeedBatchReport {
  attempted: number;
  succeeded: number;
  failed: number;
  successes: Array<{ title: string; slug: string }>;
  failures: Array<{ title: string; error: string }>;
  warnings: Array<{ title: string; warning: string }>;
}

function logResult(r: SeedSingleResult) {
  const prefix = r.success ? "✓" : "✗";
  console.log(`${prefix} ${r.title}${r.slug ? ` (${r.slug})` : ""}`);
  if (!r.success) {
    console.log(`   error: ${r.error ?? "unknown"}`);
  }
  for (const w of r.warnings) {
    console.log(`   warn: ${w}`);
  }
}

async function main(): Promise<void> {
  console.log(`Phase 4 seed run — ${PHASE_4_SEED_TOPICS.length} curated topics\n`);

  const report: Phase4SeedBatchReport = {
    attempted: PHASE_4_SEED_TOPICS.length,
    succeeded: 0,
    failed: 0,
    successes: [],
    failures: [],
    warnings: [],
  };

  // Continue-on-error: seed runs are long; we want maximum progress.
  for (const seed of PHASE_4_SEED_TOPICS) {
    console.log(`\n--- Seeding: ${seed.title} ---`);
    const result = await runSeedTopic(seed);
    logResult(result);

    if (result.success && result.slug) {
      report.succeeded += 1;
      report.successes.push({ title: result.title, slug: result.slug });
    } else {
      report.failed += 1;
      report.failures.push({ title: result.title, error: result.error ?? "unknown" });
    }

    for (const w of result.warnings) {
      report.warnings.push({ title: result.title, warning: w });
    }
  }

  console.log("\n====================");
  console.log("Phase 4 seed summary");
  console.log("====================\n");
  console.log(JSON.stringify(report, null, 2));

  if (report.succeeded < 25) {
    console.log(
      `\nNOTE: succeeded=${report.succeeded} (<25). Fix the failing items and rerun seed:phase4 (reruns update by slug).`
    );
  } else {
    console.log(`\n✓ Seed target met: ${report.succeeded} topics persisted.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

