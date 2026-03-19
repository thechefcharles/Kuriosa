/**
 * Fixture: assembled CuriosityExperience (octopus) for persistence / assembly demos.
 */

import { buildCuriosityExperienceDraft } from "@/lib/services/content/build-curiosity-experience-draft";
import type {
  GeneratedChallengeContent,
  GeneratedFollowupItem,
  GeneratedLessonContent,
  GeneratedCuriosityExperienceDraftInput,
} from "@/types/content-generation";
import type { TopicIdeaCandidate } from "@/types/content-generation";
import type { GeneratedTrailItem } from "@/types/content-generation";
import type { CuriosityExperience } from "@/types/curiosity-experience";

function octopusInput(): GeneratedCuriosityExperienceDraftInput {
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
        {
          id: "a",
          optionText:
            "Jetting demands so much muscle work that pausing reduces overload",
        },
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

export function getOctopusAssembledCuriosityExperience(): CuriosityExperience {
  return buildCuriosityExperienceDraft(octopusInput());
}
