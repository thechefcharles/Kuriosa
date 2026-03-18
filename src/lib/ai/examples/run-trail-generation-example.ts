/**
 * Example: generate curiosity trails for a topic.
 *
 * Run: npm run ai:trails
 * Requires OPENAI_API_KEY in .env.local
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { generateTrails } from "@/lib/ai/generators/generate-trails";
import {
  resolveTrailSlugCandidate,
  trailItemToCuriosityTrail,
} from "@/lib/services/content/normalize-trail-candidate";

const octopusLesson = `
Octopuses have three hearts and blue blood. Two hearts pump to the gills; one to the body.
Swimming hard can make the systemic heart pause—they often prefer crawling.
`.trim();

const lightningLesson = `
Lightning channels reach extreme temperatures in a tiny volume for microseconds—
much hotter than the Sun's surface in that instant.
`.trim();

async function runOne(
  title: string,
  category: string,
  lesson: string,
  count: number
): Promise<void> {
  console.log(`\n========== Trails from: ${title} (${count}) ==========\n`);
  const result = await generateTrails({
    currentTopicTitle: title,
    category,
    lessonSummaryOrContent: lesson,
    desiredCount: count,
    difficulty: "beginner",
    audience: "curious general audience",
    tags: ["science"],
    existingTopicLibraryContext:
      "Why do humans yawn?; How do bees make honey?; Why does ice float?",
  });

  if (!result.success) {
    console.error("Failed:", result.error);
    if (result.details) console.error(JSON.stringify(result.details, null, 2));
    return;
  }

  for (const item of result.content.trails.sort(
    (a, b) => a.sortOrder - b.sortOrder
  )) {
    const slug = resolveTrailSlugCandidate(item);
    const cx = trailItemToCuriosityTrail(item);
    console.log(`\n[${item.sortOrder}] ${item.title}`);
    console.log(`    Why: ${item.reasonText.slice(0, 160)}${item.reasonText.length > 160 ? "…" : ""}`);
    console.log(`    → slug: ${slug} | CuriosityTrail: ${cx.toTopicSlug}`);
    if (item.relationshipType) console.log(`    relationship: ${item.relationshipType}`);
    if (item.confidenceHint) console.log(`    confidence: ${item.confidenceHint}`);
  }
}

async function main(): Promise<void> {
  console.log("Kuriosa trail generation example\n");
  await runOne("Why do octopuses have three hearts?", "Science", octopusLesson, 4);
  await runOne("Why is lightning hotter than the sun?", "Science", lightningLesson, 3);
}

main().catch(console.error);
