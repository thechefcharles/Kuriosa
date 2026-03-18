/**
 * Map CuriosityExperience.followups → topic_followups insert rows.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";

export interface FollowupRowPayload {
  question_text: string;
  answer_text: string | null;
  sort_order: number;
  difficulty_level: string | null;
}

export function mapDraftToFollowupRows(
  experience: CuriosityExperience
): FollowupRowPayload[] {
  return experience.followups.map((f, index) => ({
    question_text: f.questionText,
    answer_text: f.answerText ?? null,
    sort_order: index,
    difficulty_level: f.difficultyLevel ?? null,
  }));
}
