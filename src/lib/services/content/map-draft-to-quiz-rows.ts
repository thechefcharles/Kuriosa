/**
 * Map CuriosityExperience.challenge → quizzes + quiz_options rows.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";

export interface QuizInsertPayload {
  quiz_type: string;
  question_text: string;
  explanation_text: string | null;
  difficulty_level: string | null;
  sort_order: number;
  memory_recall_hints: string | null;
}

export interface QuizOptionInsertPayload {
  option_text: string;
  is_correct: boolean;
}

export function mapDraftToPrimaryQuiz(
  experience: CuriosityExperience
): {
  quiz: QuizInsertPayload;
  options: QuizOptionInsertPayload[];
} {
  const c = experience.challenge;
  const isRecall = c.quizType === "memory_recall";

  const correctTexts = c.options.filter((o) => o.isCorrect).map((o) => o.optionText);
  const hints =
    isRecall && correctTexts.length > 0
      ? JSON.stringify(correctTexts)
      : null;

  return {
    quiz: {
      quiz_type: c.quizType,
      question_text: c.questionText,
      explanation_text: c.explanationText ?? null,
      difficulty_level: c.difficultyLevel ?? null,
      sort_order: 0,
      memory_recall_hints: hints,
    },
    options: c.options.map((o) => ({
      option_text: o.optionText,
      is_correct: o.isCorrect,
    })),
  };
}
