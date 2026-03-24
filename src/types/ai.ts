/**
 * Phase 9 — AI Curiosity Engine types.
 * Follow-up generation, question answering, rabbit-hole suggestions.
 */

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
};

/** Input for generating rabbit-hole suggestions */
export type RabbitHoleGenerationInput = {
  topicId: string;
  topicTitle: string;
  questionText?: string;
  lessonExcerpt?: string;
};
