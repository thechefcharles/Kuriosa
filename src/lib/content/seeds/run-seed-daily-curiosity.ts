/**
 * Seed today's daily_curiosity row. Uses first published topic by created_at.
 * Run: npm run seed:daily
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 * Prerequisite: at least one published topic exists.
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main(): Promise<void> {
  console.log("Seeding daily_curiosity for today (UTC)...\n");

  const supabase = getSupabaseServiceRoleClient();
  const date = todayUTC();

  const { data: topic, error: topicErr } = await supabase
    .from("topics")
    .select("id, slug, title")
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (topicErr || !topic) {
    console.error(
      "No published topic found. Run ten-demo-curiosities.sql or seed:phase4 first."
    );
    process.exit(1);
  }

  const { error: upsertErr } = await supabase.from("daily_curiosity").upsert(
    {
      date,
      topic_id: topic.id,
      theme: "Kuriosa demo",
    },
    { onConflict: "date" }
  );

  if (upsertErr) {
    console.error("Upsert failed:", upsertErr.message);
    process.exit(1);
  }

  console.log(`✓ daily_curiosity set for ${date}`);
  console.log(`  Topic: ${topic.title} (${topic.slug})`);
  console.log("\nHome page will now show today's curiosity.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
