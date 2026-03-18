/**
 * Example CuriosityExperience fixture for testing and development.
 * Must pass Zod validation.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";

export const exampleCuriosityExperience: CuriosityExperience = {
  identity: {
    id: "example-octopus-hearts",
    slug: "why-octopuses-have-three-hearts",
    title: "Why Do Octopuses Have Three Hearts?",
  },
  discoveryCard: {
    hookQuestion: "Why do octopuses have three hearts?",
    shortSummary:
      "Discover how octopuses evolved three hearts to power their unique blue blood and jet-propelled lifestyle.",
    estimatedMinutes: 5,
  },
  taxonomy: {
    category: "Science",
    categorySlug: "science",
    subcategory: "Biology",
    difficultyLevel: "beginner",
    tags: ["marine-life", "anatomy", "evolution"],
  },
  lesson: {
    lessonText:
      "Octopuses have three hearts because of their unusual circulatory system. Two branchial hearts pump blood through the gills, where it picks up oxygen. The systemic heart then pumps this oxygenated blood to the rest of the body. When an octopus swims by jet propulsion, the systemic heart stops beating—that's why octopuses prefer crawling to swimming.\n\nTheir blood is blue, not red, because it uses copper-based hemocyanin instead of iron-based hemoglobin to carry oxygen. Cold, low-oxygen waters favor this design.",
    surprisingFact:
      "The systemic heart stops beating when the octopus swims, so they often crawl to avoid exhaustion.",
    realWorldRelevance:
      "Understanding octopus circulation helps marine biologists study their behavior and informs conservation efforts.",
  },
  audio: {
    audioUrl: "https://example.com/audio/octopus-hearts.mp3",
    durationSeconds: 180,
    transcript: "Example narration transcript for tests.",
  },
  challenge: {
    id: "quiz-octopus-1",
    questionText: "Why does the systemic heart stop when an octopus swims?",
    quizType: "multiple_choice",
    options: [
      { optionText: "To save energy during jet propulsion", isCorrect: true },
      { optionText: "Because the gills take over circulation", isCorrect: false },
      { optionText: "To prevent blood clotting", isCorrect: false },
      { optionText: "Octopus hearts never stop", isCorrect: false },
    ],
    explanationText:
      "The systemic heart temporarily stops during jet propulsion because the muscular effort required would overload the circulatory system.",
    difficultyLevel: "beginner",
  },
  rewards: {
    xpAward: 25,
    levelHint: 1,
  },
  followups: [
    {
      id: "f1-octopus",
      questionText: "What gives octopus blood its blue color?",
      answerText: "Copper-based hemocyanin, which is more efficient than hemoglobin in cold, low-oxygen water.",
      difficultyLevel: "beginner",
    },
    {
      id: "f2-octopus",
      questionText: "How do the branchial hearts differ from the systemic heart?",
      answerText:
        "The two branchial hearts pump blood through the gills for oxygenation; the systemic heart pumps oxygenated blood to the body.",
      difficultyLevel: "intermediate",
    },
  ],
  trails: [
    {
      toTopicSlug: "how-squid-jets-work",
      toTopicTitle: "How Squid Jet Propulsion Works",
      reasonText: "Another cephalopod with fascinating propulsion",
      sortOrder: 0,
    },
    {
      toTopicSlug: "animal-hearts-compared",
      toTopicTitle: "Animal Hearts Compared",
      reasonText: "Explore other unusual circulatory systems",
      sortOrder: 1,
    },
  ],
  progressionHooks: {
    suggestedBadges: ["curious-mind", "first-step"],
    nextTrailSlugs: ["how-squid-jets-work", "animal-hearts-compared"],
  },
  moderation: {
    status: "approved",
    notes: "Example fixture",
  },
  analytics: {
    sourceType: "fixture",
    version: 1,
  },
};
