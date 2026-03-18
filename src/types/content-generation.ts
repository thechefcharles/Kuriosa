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

/** Inputs for `generateAudioScript`. */
export interface GeneratedAudioRequestOptions {
  topicTitle: string;
  category: string;
  difficulty?: string;
  /** Plain lesson text when no structured lesson object */
  lessonText?: string;
  /** Prefer this over lessonText when both exist */
  generatedLesson?: GeneratedLessonContent;
  targetDurationSeconds?: number;
  targetWordCount?: number;
  audience?: string;
  tone?: string;
}

/** Validated narration payload (maps to CuriosityAudio transcript + duration; audioUrl later). */
export interface GeneratedAudioScript {
  audioScript: string;
  transcriptText: string;
  durationSecondsEstimate: number;
  estimatedWordCount: number;
  titleIntroLine?: string;
  closingLine?: string;
  voiceStyleHint?: string;
}

export interface GeneratedAudioContent {
  audio: GeneratedAudioScript;
}

/** Map generator output to CuriosityExperience audio fields (no URL until TTS). */
export function generatedAudioToCuriosityFields(script: GeneratedAudioScript): {
  transcript: string;
  durationSeconds: number;
} {
  return {
    transcript: script.transcriptText,
    durationSeconds: script.durationSecondsEstimate,
  };
}

/** Single MC / logic option row (ids stable for correctOptionId). */
export interface GeneratedQuizOption {
  id: "a" | "b" | "c" | "d";
  optionText: string;
}

/** Primary challenge: main quiz after the lesson. */
export type GeneratedPrimaryQuiz =
  | {
      quizType: "multiple_choice" | "logic";
      questionText: string;
      options: GeneratedQuizOption[];
      correctOptionId: "a" | "b" | "c" | "d";
      explanationText: string;
    }
  | {
      quizType: "memory_recall";
      questionText: string;
      correctAnswer: string;
      explanationText: string;
    };

/** Bonus challenge: lighter follow-on (recall or quick MC). */
export type GeneratedBonusQuestion =
  | {
      quizType: "memory_recall";
      questionText: string;
      acceptedAnswers: string[];
      explanationText: string;
    }
  | {
      quizType: "multiple_choice" | "logic";
      questionText: string;
      options: GeneratedQuizOption[];
      correctOptionId: "a" | "b" | "c" | "d";
      explanationText: string;
    };

/** Inputs for `generateChallenge`. */
export interface GeneratedChallengeRequestOptions {
  topicTitle: string;
  category: string;
  difficulty?: string;
  /** Lesson summary or full lesson text the quiz must align with */
  lessonSummaryOrContent: string;
  /** Hint which modalities to use (e.g. primary multiple_choice + bonus memory_recall) */
  desiredChallengeTypes?: Array<"multiple_choice" | "memory_recall" | "logic">;
  tags?: string[];
  audience?: string;
}

/** Validated challenge pack from the model. */
export interface GeneratedChallengeContent {
  primary: GeneratedPrimaryQuiz;
  bonus: GeneratedBonusQuestion;
  /** Suggested XP for primary challenge (rewards assembly later) */
  primaryXpAward?: number;
  bonusXpAward?: number;
}

/**
 * Map primary quiz to CuriosityExperience-style options (empty for memory_recall until assembly adds UX).
 */
export function primaryQuizToCuriosityOptions(
  primary: GeneratedPrimaryQuiz
): { optionText: string; isCorrect: boolean }[] {
  if (primary.quizType === "memory_recall") {
    return [];
  }
  return primary.options.map((o) => ({
    optionText: o.optionText,
    isCorrect: o.id === primary.correctOptionId,
  }));
}

/** Options for `generateFollowups`. */
export interface GeneratedFollowupRequestOptions {
  topicTitle: string;
  category: string;
  subcategory?: string;
  difficulty?: string;
  lessonSummaryOrContent: string;
  tags?: string[];
  audience?: string;
  /** Number of follow-ups (clamped to 3–5). Default 4. */
  desiredCount?: number;
}

/** One suggested follow-up row from the model (maps to topic_followups / CuriosityFollowup). */
export interface GeneratedFollowupItem {
  questionText: string;
  answerSnippet: string;
  difficultyLevel: "beginner" | "intermediate" | "advanced";
  sortOrder: number;
  rationale?: string;
  tagHints?: string[];
}

/** Validated API payload: list of follow-ups. */
export interface GeneratedFollowupContent {
  followups: GeneratedFollowupItem[];
}

/** Map generator item → CuriosityExperience follow-up fields (answerSnippet → answerText). */
export function followupItemToCuriosityFields(item: GeneratedFollowupItem): {
  questionText: string;
  answerText: string;
  difficultyLevel: string;
} {
  return {
    questionText: item.questionText,
    answerText: item.answerSnippet,
    difficultyLevel: item.difficultyLevel,
  };
}

/** Options for `generateTrails`. */
export interface GeneratedTrailRequestOptions {
  currentTopicTitle: string;
  category: string;
  subcategory?: string;
  difficulty?: string;
  tags?: string[];
  lessonSummaryOrContent: string;
  /** Optional list of existing/planned titles to reduce repetition */
  existingTopicLibraryContext?: string;
  audience?: string;
  /** Number of trails (clamped to 2–6). Default 4. */
  desiredCount?: number;
}

/** One suggested next-topic trail from the model. */
export interface GeneratedTrailItem {
  title: string;
  reasonText: string;
  sortOrder: number;
  category?: string;
  subcategory?: string;
  tags?: string[];
  slugCandidate?: string;
  relationshipType?:
    | "same_category"
    | "deeper_dive"
    | "tangential"
    | "contrast"
    | "application";
  confidenceHint?: "high" | "medium" | "speculative";
}

/** Validated API payload. */
export interface GeneratedTrailContent {
  trails: GeneratedTrailItem[];
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
  challenge: GeneratedChallengeContent;
  rewards: { xpAward: number; levelHint?: number };
  followups: (GeneratedFollowupItem & { id?: string })[];
  trails: (GeneratedTrailItem & { id?: string; toTopicId?: string })[];
  audio?: { audioUrl?: string; transcript?: string; durationSeconds?: number };
  progressionHooks?: { suggestedBadges?: string[]; nextTrailSlugs?: string[] };
  moderation?: { status?: string; notes?: string };
  analytics?: { sourceType?: string; generatedAt?: string; version?: number };
}
