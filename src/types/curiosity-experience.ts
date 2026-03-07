/**
 * Canonical Kuriosa CuriosityExperience content model.
 * This is the assembled object consumed by the frontend and validated by Zod.
 */

/** Core identity: id, slug, title. */
export interface CuriosityIdentity {
  id: string;
  slug: string;
  title: string;
}

/** Discovery card: hook for browsing/feeds. */
export interface CuriosityDiscoveryCard {
  hookQuestion: string;
  shortSummary: string;
  estimatedMinutes: number;
}

/** Taxonomy: category, subcategory, difficulty, tags. */
export interface CuriosityTaxonomy {
  category: string;
  categorySlug: string;
  subcategory?: string;
  difficultyLevel: string;
  tags: string[];
}

/** Lesson content: main text and supporting content. */
export interface CuriosityLesson {
  lessonText: string;
  surprisingFact?: string;
  realWorldRelevance?: string;
}

/** Audio narration metadata. */
export interface CuriosityAudio {
  audioUrl?: string;
  transcript?: string;
  durationSeconds?: number;
}

/** Single quiz option. */
export interface CuriosityQuizOption {
  optionText: string;
  isCorrect: boolean;
}

/** Challenge: question, options, explanation. */
export interface CuriosityChallenge {
  id: string;
  questionText: string;
  quizType: "multiple_choice" | "reasoning" | "logic" | string;
  options: CuriosityQuizOption[];
  explanationText?: string;
  difficultyLevel?: string;
}

/** XP and level rewards. */
export interface CuriosityRewards {
  xpAward: number;
  levelHint?: number;
}

/** Follow-up Q&A. */
export interface CuriosityFollowup {
  id: string;
  questionText: string;
  answerText?: string;
  difficultyLevel?: string;
}

/** Trail: related topic recommendation. */
export interface CuriosityTrail {
  toTopicSlug: string;
  toTopicTitle: string;
  reasonText: string;
  sortOrder: number;
}

/** Progression hooks for gamification. */
export interface CuriosityProgressionHooks {
  suggestedBadges?: string[];
  nextTrailSlugs?: string[];
}

/** Moderation metadata. */
export interface CuriosityModeration {
  reviewedAt?: string;
  status?: "pending" | "approved" | "flagged";
  notes?: string;
}

/** Analytics and source metadata. */
export interface CuriosityAnalyticsMetadata {
  sourceType?: string;
  generatedAt?: string;
  version?: number;
}

/** Canonical CuriosityExperience: assembled content object. */
export interface CuriosityExperience {
  identity: CuriosityIdentity;
  discoveryCard: CuriosityDiscoveryCard;
  taxonomy: CuriosityTaxonomy;
  lesson: CuriosityLesson;
  audio?: CuriosityAudio;
  challenge: CuriosityChallenge;
  rewards: CuriosityRewards;
  followups: CuriosityFollowup[];
  trails: CuriosityTrail[];
  progressionHooks?: CuriosityProgressionHooks;
  moderation?: CuriosityModeration;
  analytics?: CuriosityAnalyticsMetadata;
}
