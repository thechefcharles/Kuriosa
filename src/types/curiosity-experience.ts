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

/**
 * Draft / CMS optional audio fields (URL may be set before file exists).
 * Loader produces {@link CuriosityAudioBlock} or null on the read model.
 */
export interface CuriosityAudio {
  audioUrl?: string;
  transcript?: string;
  durationSeconds?: number;
}

/** Valid listenable audio attached to a loaded topic (canonical playback + metadata). */
export interface CuriosityAudioBlock {
  audioUrl: string;
  durationSeconds: number | null;
  transcript: string | null;
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

/** Editorial / lifecycle status for drafts and published content. */
export type CuriosityReviewStatus =
  | "draft"
  | "reviewed"
  | "published"
  | "rejected"
  | "archived";

/** Provenance of assembled content. */
export type CuriosityContentSourceType =
  | "ai_generated"
  | "ai_generated_editor_reviewed"
  | "manual";

/** Moderation metadata. */
export interface CuriosityModeration {
  reviewedAt?: string;
  /** Legacy review gate */
  status?: "pending" | "approved" | "flagged";
  notes?: string;
  /** Pipeline / CMS lifecycle */
  reviewStatus?: CuriosityReviewStatus;
  /** e.g. ["needs-fact-check"]; empty when clean */
  safetyFlags?: string[];
}

/** Analytics and source metadata. */
export interface CuriosityAnalyticsMetadata {
  sourceType?: CuriosityContentSourceType | string;
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

/**
 * Read model from Postgres: same as CuriosityExperience but challenge may be
 * absent when no quiz row exists yet.
 */
export type LoadedCuriosityExperience = Omit<
  CuriosityExperience,
  "challenge" | "audio"
> & {
  challenge?: CuriosityChallenge;
  /** Optional second (bonus) question; sort_order 1. Grants bonus XP when correct. */
  bonusChallenge?: CuriosityChallenge;
  /** null = no valid audio URL; object = Listen Mode ready */
  audio: CuriosityAudioBlock | null;
};
