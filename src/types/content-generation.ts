/**
 * Intermediate types for the AI content generation pipeline.
 * Represents raw or partial outputs before assembly into CuriosityExperience.
 */

/** Raw topic idea from discovery/generation. */
export interface TopicIdeaCandidate {
  title: string;
  hookQuestion: string;
  category: string;
  subcategory?: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  tags: string[];
}

/** Generated lesson content before assembly. */
export interface GeneratedLessonContent {
  lessonText: string;
  surprisingFact?: string;
  realWorldRelevance?: string;
}

/** Generated challenge content before assembly. */
export interface GeneratedChallengeContent {
  questionText: string;
  quizType: string;
  options: { optionText: string; isCorrect: boolean }[];
  explanationText?: string;
}

/** Generated follow-up Q&A before assembly. */
export interface GeneratedFollowupContent {
  questionText: string;
  answerText?: string;
  difficultyLevel?: string;
}

/** Generated trail recommendation before assembly. */
export interface GeneratedTrailContent {
  toTopicSlug: string;
  toTopicTitle: string;
  reasonText: string;
  sortOrder: number;
}

/** Draft assembled from AI outputs; may need validation before becoming CuriosityExperience. */
export interface GeneratedCuriosityExperienceDraft {
  identity: {
    id?: string;
    slug: string;
    title: string;
  };
  discoveryCard: {
    hookQuestion: string;
    shortSummary: string;
    estimatedMinutes: number;
  };
  taxonomy: {
    category: string;
    categorySlug: string;
    subcategory?: string;
    difficultyLevel: string;
    tags: string[];
  };
  lesson: GeneratedLessonContent;
  challenge: GeneratedChallengeContent & { id?: string };
  rewards: { xpAward: number; levelHint?: number };
  followups: (GeneratedFollowupContent & { id?: string })[];
  trails: GeneratedTrailContent[];
  audio?: { audioUrl?: string; transcript?: string; durationSeconds?: number };
  progressionHooks?: { suggestedBadges?: string[]; nextTrailSlugs?: string[] };
  moderation?: { status?: string; notes?: string };
  analytics?: { sourceType?: string; generatedAt?: string; version?: number };
}
