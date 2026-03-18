/**
 * Types for CuriosityExperience → Supabase persistence (Phase 4.9).
 */

export interface PersistCuriosityExperienceResult {
  success: boolean;
  topicId?: string;
  topicSlug: string;
  rowsWritten: {
    topicUpserted: boolean;
    tags: number;
    followups: number;
    quizzes: number;
    quizOptions: number;
    trails: number;
  };
  warnings: string[];
  unresolvedTrails: Array<{
    toTopicSlug: string;
    toTopicTitle: string;
    reasonText: string;
    sortOrder: number;
  }>;
  error?: string;
}
