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

/** Options passed to the lesson generator (prompt inputs). */
export interface GeneratedLessonRequestOptions {
  topicTitle: string;
  category: string;
  subcategory?: string;
  audience?: string;
  /** e.g. beginner — informs voice depth in the prompt */
  difficulty?: string;
  /** Approximate total words for intro + body */
  targetWordCount?: number;
  tone?: string;
  tags?: string[];
  /** Extra hook or question framing for the model */
  hookContext?: string;
}

/**
 * Validated lesson output from the AI before assembly into CuriosityExperience.
 * Maps to: identity.title, discoveryCard (hookText, shortSummary, estimatedMinutes),
 * taxonomy (difficultyLevel, tags), lesson (concat intro+body → lessonText),
 * rewards (xpAward, levelHint), and future audio from body+intro as script source.
 */
export interface GeneratedLessonContent {
  title: string;
  hookText: string;
  shortSummary: string;
  intro: string;
  body: string;
  surprisingFact: string;
  realWorldRelevance: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  estimatedMinutes: number;
  tags: string[];
  xpAward: number;
  levelHint?: number;
}

/** Concatenate intro + body for CuriosityLesson.lessonText when assembling. */
export function composeLessonTextFromGenerated(lesson: GeneratedLessonContent): string {
  return `${lesson.intro.trim()}\n\n${lesson.body.trim()}`;
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

/**
 * Draft assembled from AI outputs; may need validation before becoming CuriosityExperience.
 * When lesson is filled from generateLesson, map fields per CuriosityExperience sections.
 */
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
  /** Full generated lesson blob; use composeLessonTextFromGenerated for CuriosityLesson.lessonText */
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
