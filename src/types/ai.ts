/**
 * Phase 9 — AI Curiosity Engine types.
 * Follow-up generation, question answering, rabbit-hole suggestions.
 */

/** Topic context for AI generation. Shared by follow-ups, rabbit holes, answers. */
export type TopicAIContext = {
  topicId: string;
  slug: string;
  title: string;
  categoryName: string;
  categorySlug: string;
  subcategory?: string;
  hookText?: string;
  lessonExcerpt?: string;
  tags: string[];
};

/** Single follow-up question (UI-friendly) */
export type GuidedFollowupItem = {
  questionText: string;
};

/** Result of get-topic-followups */
export type TopicFollowupResult =
  | { ok: true; questions: string[]; fromStorage: boolean; topicId: string }
  | { ok: false; error: string };

/** Single rabbit-hole suggestion (UI-friendly) */
export type TopicRabbitHoleItem = {
  title: string;
  reasonText?: string;
};

/** Result of get-topic-rabbit-holes */
export type RabbitHoleSuggestionResult =
  | { ok: true; suggestions: TopicRabbitHoleItem[]; fromCache: boolean; topicId: string }
  | { ok: false; error: string };

/** Result of get-guided-topic-exploration */
export type GuidedTopicExplorationResult =
  | {
      ok: true;
      topicContext: TopicAIContext;
      followups: string[];
      followupsFromStorage: boolean;
      rabbitHoles: TopicRabbitHoleItem[];
      rabbitHolesFromCache: boolean;
    }
  | { ok: false; error: string };

export type AIQuestionSource = "followup" | "manual";

export type AIQuestion = {
  id: string;
  userId: string | null;
  topicId: string;
  questionText: string;
  source: AIQuestionSource;
  createdAt: string;
};

export type AIAnswer = {
  id: string;
  questionId: string;
  answerText: string;
  model: string | null;
  tokensUsed: number | null;
  createdAt: string;
};

export type AIFollowupSet = {
  id: string;
  topicId: string;
  questions: string[];
  createdAt: string;
};

export type AICacheEntry = {
  id: string;
  cacheKey: string;
  response: unknown;
  createdAt: string;
};

/** Input for generating follow-up questions for a topic */
export type FollowupGenerationInput = {
  topicId: string;
  topicTitle: string;
  lessonExcerpt?: string;
};

/** Input for generating an answer to a user question */
export type AnswerGenerationInput = {
  topicId: string;
  topicTitle: string;
  questionText: string;
  lessonContext?: string;
  categoryName?: string;
};

/** Interaction type for analytics (Phase 9.5) */
export type AIInteractionType = "guided_followup" | "manual" | "rabbit_hole";

/** Input for manual question flow */
export type ManualQuestionInput = {
  userId: string;
  topicId?: string;
  slug?: string;
  questionText: string;
  /** For analytics; defaults to 'manual' */
  interactionType?: AIInteractionType;
};

/** Result from manual question answering */
export type ManualQuestionResult =
  | {
      ok: true;
      question: string;
      answerText: string;
      fromCache: boolean;
      moderated: boolean;
      rateLimited: false;
      fallbackUsed: boolean;
      questionId?: string;
      answerId?: string;
    }
  | {
      ok: false;
      question?: string;
      answerText?: string;
      fromCache: false;
      moderated: boolean;
      rateLimited: boolean;
      fallbackUsed: boolean;
      error: string;
      questionId?: string;
      answerId?: string;
    };

/** Result from persisting ai_questions row */
export type PersistedAIQuestionResult =
  | { ok: true; questionId: string }
  | { ok: false; error: string };

/** Result from persisting ai_answers row */
export type PersistedAIAnswerResult =
  | { ok: true; answerId: string }
  | { ok: false; error: string };

/** Result from answer generation (internal) */
export type AnswerGenerationResult =
  | { ok: true; answerText: string; model?: string; tokensUsed?: number }
  | { ok: false; error: string };

/** Input for generating rabbit-hole suggestions */
export type RabbitHoleGenerationInput = {
  topicId: string;
  topicTitle: string;
  questionText?: string;
  lessonExcerpt?: string;
};
