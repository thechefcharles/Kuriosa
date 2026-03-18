/**
 * Client-safe challenge answer validation (single primary quiz per topic).
 */

import type { CuriosityChallenge } from "@/types/curiosity-experience";

export type ChallengeAnswerInput =
  | { kind: "choice"; selectedIndex: number }
  | { kind: "recall"; text: string };

export type ChallengeValidationResult = {
  isCorrect: boolean;
  explanation?: string;
  /** Human-readable correct answer(s) for feedback when wrong */
  correctAnswerDisplay: string;
  /** User’s normalized recall answer when applicable */
  normalizedUserAnswer?: string;
};

function normalizeAnswerText(s: string): string {
  return s.replace(/\s+/g, " ").trim().toLowerCase();
}

function correctOptionTexts(challenge: CuriosityChallenge): string[] {
  return challenge.options.filter((o) => o.isCorrect).map((o) => o.optionText.trim());
}

function correctAnswerDisplay(challenge: CuriosityChallenge): string {
  const texts = correctOptionTexts(challenge);
  if (texts.length === 0) return "—";
  if (texts.length === 1) return texts[0]!;
  return texts.join(" · ");
}

export function normalizeQuizType(quizType: string): string {
  return quizType.trim().toLowerCase().replace(/-/g, "_");
}

export function isMemoryRecallChallenge(challenge: CuriosityChallenge): boolean {
  const t = normalizeQuizType(challenge.quizType);
  return t === "memory_recall" || t === "recall";
}

export function validateChallengeAnswer(
  challenge: CuriosityChallenge,
  input: ChallengeAnswerInput
): ChallengeValidationResult {
  const explanation = challenge.explanationText?.trim();
  const correctDisplay = correctAnswerDisplay(challenge);
  const recall = isMemoryRecallChallenge(challenge);

  if (recall && input.kind === "recall") {
    const normalized = normalizeAnswerText(input.text);
    if (!normalized) {
      return {
        isCorrect: false,
        explanation,
        correctAnswerDisplay: correctDisplay,
        normalizedUserAnswer: normalized,
      };
    }
    const accepted = correctOptionTexts(challenge).map(normalizeAnswerText);
    const isCorrect = accepted.some((a) => a === normalized);
    return {
      isCorrect,
      explanation,
      correctAnswerDisplay: correctDisplay,
      normalizedUserAnswer: normalized,
    };
  }

  if (recall && input.kind === "choice") {
    return validateChallengeAnswer(challenge, {
      kind: "recall",
      text: challenge.options[input.selectedIndex]?.optionText ?? "",
    });
  }

  if (input.kind !== "choice") {
    return {
      isCorrect: false,
      explanation,
      correctAnswerDisplay: correctDisplay,
    };
  }

  const opt = challenge.options[input.selectedIndex];
  if (!opt) {
    return {
      isCorrect: false,
      explanation,
      correctAnswerDisplay: correctDisplay,
    };
  }

  return {
    isCorrect: Boolean(opt.isCorrect),
    explanation,
    correctAnswerDisplay: correctDisplay,
  };
}
