/**
 * Assemble a full CuriosityExperience from fixture-like generator outputs.
 *
 * Run: npm run ai:assemble-draft
 * No OpenAI calls — uses static typed inputs.
 */

import { buildCuriosityExperienceDraft } from "@/lib/services/content/build-curiosity-experience-draft";
import { safeValidateCuriosityExperienceDraft } from "@/lib/validations/assembled-curiosity-draft";
import type {
  GeneratedChallengeContent,
  GeneratedFollowupItem,
  GeneratedLessonContent,
  GeneratedTrailItem,
  GeneratedCuriosityExperienceDraftInput,
} from "@/types/content-generation";
import type { TopicIdeaCandidate } from "@/types/content-generation";

function octopusFixtures(): GeneratedCuriosityExperienceDraftInput {
  const topicIdea: TopicIdeaCandidate = {
    title: "Why do octopuses have three hearts?",
    hookQuestion: "Why do octopuses have three hearts?",
    category: "Science",
    subcategory: "Marine biology",
    difficultyLevel: "beginner",
    estimatedMinutes: 5,
    tags: ["octopus", "hearts", "marine"],
  };

  const lesson: GeneratedLessonContent = {
    title: "Why Do Octopuses Have Three Hearts?",
    hookText: "Why do octopuses have three hearts?",
    shortSummary:
      "Three hearts and blue blood power one of the ocean's smartest invertebrates.",
    intro:
      "If you picture an octopus jetting through the water, you might not picture three hearts beating inside—but they are there, working in a relay that looks nothing like our own circulation.",
    body:
      "Two branchial hearts send blood through the gills to pick up oxygen. A larger systemic heart then pushes that oxygen-rich blood everywhere else. When an octopus swims hard by jet propulsion, the systemic heart can pause—crawling is often cheaper, metabolically. Their blood runs blue because it uses copper-based hemocyanin instead of iron-based hemoglobin—handy in cold, low-oxygen water.",
    surprisingFact:
      "The systemic heart can stop beating during vigorous jet swimming.",
    realWorldRelevance:
      "Understanding cephalopod circulation helps researchers study stress, movement, and conservation.",
    difficultyLevel: "beginner",
    estimatedMinutes: 5,
    tags: ["marine-life", "anatomy", "evolution"],
    xpAward: 28,
    levelHint: 1,
  };

  const challenge: GeneratedChallengeContent = {
    primary: {
      quizType: "multiple_choice",
      questionText: "Why does the systemic heart often pause during fast jet swimming?",
      options: [
        { id: "a", optionText: "Jetting demands so much muscle work that pausing reduces overload" },
        { id: "b", optionText: "The gills stop needing blood during swimming" },
        { id: "c", optionText: "Octopuses have no systemic heart while moving" },
        { id: "d", optionText: "Blood turns red and stops flowing" },
      ],
      correctOptionId: "a",
      explanationText:
        "Jet propulsion is intense; briefly pausing the systemic heart is thought to help the animal avoid circulatory strain.",
    },
    bonus: {
      quizType: "memory_recall",
      questionText: "What metal makes octopus blood appear blue?",
      acceptedAnswers: ["copper", "hemocyanin", "copper-based hemocyanin"],
      explanationText: "Copper in hemocyanin turns the blood blue when oxygenated.",
    },
    primaryXpAward: 18,
    bonusXpAward: 8,
  };

  const followups: GeneratedFollowupItem[] = [
    {
      questionText: "What is hemocyanin compared to hemoglobin?",
      answerSnippet:
        "Hemocyanin uses copper to carry oxygen; hemoglobin uses iron—octopuses use the former.",
      difficultyLevel: "intermediate",
      sortOrder: 1,
    },
    {
      questionText: "Do all cephalopods have three hearts?",
      answerSnippet:
        "Squid and cuttlefish share a similar three-heart layout; nautiluses differ in detail.",
      difficultyLevel: "beginner",
      sortOrder: 2,
    },
    {
      questionText: "Why crawl instead of swim?",
      answerSnippet:
        "Crawling costs less oxygen; jetting is for escape bursts.",
      difficultyLevel: "beginner",
      sortOrder: 3,
    },
  ];

  const trails: GeneratedTrailItem[] = [
    {
      title: "How does squid jet propulsion work?",
      reasonText: "Another cephalopod with extreme movement—and circulation tradeoffs.",
      sortOrder: 1,
      slugCandidate: "how-squid-jet-propulsion-works",
      relationshipType: "same_category",
    },
    {
      title: "Why is octopus intelligence so unusual?",
      reasonText: "Brains, behavior, and hearts—octopuses break a lot of rules.",
      sortOrder: 2,
      relationshipType: "deeper_dive",
    },
  ];

  return {
    topicIdea,
    lesson,
    challenge,
    followups,
    trails,
    assemblyOptions: {
      reviewStatus: "draft",
      sourceType: "ai_generated",
      safetyFlags: [],
      contentVersion: 1,
    },
  };
}

function lightningFixtures(): GeneratedCuriosityExperienceDraftInput {
  const topicIdea: TopicIdeaCandidate = {
    title: "Why is lightning hotter than the sun?",
    hookQuestion: "Why is lightning hotter than the sun?",
    category: "Science",
    subcategory: "Physics",
    difficultyLevel: "beginner",
    estimatedMinutes: 4,
    tags: ["weather", "energy"],
  };

  const lesson: GeneratedLessonContent = {
    title: "Why Is Lightning Hotter Than the Sun?",
    hookText: "Why is lightning hotter than the sun?",
    shortSummary:
      "A bolt concentrates incredible energy in a hair-thin channel for a split second.",
    intro:
      "The Sun’s surface is around 5,500°C—yet a lightning channel can reach tens of thousands of degrees. That sounds impossible until you think about volume and time.",
    body:
      "Lightning dumps electrical energy into an extremely narrow path. All that heat is packed into a tiny volume for microseconds, so the temperature in that instant spikes far above the Sun’s average surface. It is a different kind of hot: intense but fleeting, not the steady glow of a star.",
    surprisingFact:
      "A lightning flash can exceed 30,000°C along the channel—even though it lasts a fraction of a second.",
    realWorldRelevance:
      "Engineers study lightning to protect buildings, aircraft, and power grids.",
    difficultyLevel: "beginner",
    estimatedMinutes: 4,
    tags: ["lightning", "physics", "weather"],
    xpAward: 24,
    levelHint: 1,
  };

  const challenge: GeneratedChallengeContent = {
    primary: {
      quizType: "logic",
      questionText: "Why can lightning feel ‘hotter’ than the Sun’s surface despite the Sun being huge?",
      options: [
        { id: "a", optionText: "Energy is crammed into a very thin channel for a tiny moment" },
        { id: "b", optionText: "The Sun is actually colder everywhere" },
        { id: "c", optionText: "Lightning steals heat from the Sun" },
        { id: "d", optionText: "Temperature cannot exceed the Sun’s surface" },
      ],
      correctOptionId: "a",
      explanationText:
        "Peak temperature depends on how energy is concentrated—not only on total output.",
    },
    bonus: {
      quizType: "multiple_choice",
      questionText: "Roughly how long does a lightning flash last compared to reading this sentence?",
      options: [
        { id: "a", optionText: "Microseconds to milliseconds—much shorter" },
        { id: "b", optionText: "Several minutes" },
        { id: "c", optionText: "Exactly one second always" },
        { id: "d", optionText: "As long as thunder echoes" },
      ],
      correctOptionId: "a",
      explanationText: "The visible flash is extremely brief even if thunder lingers.",
    },
    primaryXpAward: 16,
  };

  const followups: GeneratedFollowupItem[] = [
    {
      questionText: "Is every part of the Sun cooler than lightning?",
      answerSnippet:
        "The core is far hotter; we usually compare lightning to the Sun’s visible surface.",
      difficultyLevel: "intermediate",
      sortOrder: 1,
    },
    {
      questionText: "Why do we hear thunder after the flash?",
      answerSnippet: "Light travels faster than sound through air.",
      difficultyLevel: "beginner",
      sortOrder: 2,
    },
  ];

  const trails: GeneratedTrailItem[] = [
    {
      title: "How does thunder form?",
      reasonText: "Sound energy from the same storm system.",
      sortOrder: 1,
      slugCandidate: "how-does-thunder-form",
    },
  ];

  return {
    topicIdea,
    lesson,
    challenge,
    followups,
    trails,
    assemblyOptions: { reviewStatus: "draft", sourceType: "ai_generated", safetyFlags: [] },
  };
}

async function main(): Promise<void> {
  console.log("CuriosityExperience draft assembly (fixtures)\n");

  for (const [label, fixtures] of [
    ["Octopus", octopusFixtures()],
    ["Lightning", lightningFixtures()],
  ] as const) {
    const draft = buildCuriosityExperienceDraft(fixtures);
    const validated = safeValidateCuriosityExperienceDraft(draft);

    console.log(`\n========== ${label} ==========`);
    if (!validated.success) {
      console.error("Validation failed:", validated.error, validated.details);
      continue;
    }
    const x = validated.data;
    console.log("identity:", x.identity);
    console.log("discoveryCard.hook:", x.discoveryCard.hookQuestion.slice(0, 50) + "…");
    console.log("taxonomy:", x.taxonomy.category, "/", x.taxonomy.categorySlug);
    console.log("lesson chars:", x.lesson.lessonText.length);
    console.log("challenge:", x.challenge.quizType, "| options:", x.challenge.options.length);
    console.log("followups:", x.followups.length, "| trails:", x.trails.length);
    console.log("rewards:", x.rewards);
    console.log("moderation:", x.moderation?.reviewStatus, "| flags:", x.moderation?.safetyFlags?.length);
    console.log("analytics:", x.analytics?.sourceType, "v", x.analytics?.version);
    console.log("progression nextTrailSlugs:", x.progressionHooks?.nextTrailSlugs?.join(", "));
    if (x.moderation?.notes) {
      console.log("notes (bonus + assembly, excerpt):", x.moderation.notes.slice(0, 120) + "…");
    }
  }
}

main().catch(console.error);
