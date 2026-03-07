/**
 * Assemble CuriosityExperience from normalized database content.
 *
 * Database tables (topics, quizzes, quiz_options, topic_followups, topic_trails, etc.)
 * store content in normalized form. This module will assemble that data into
 * a single CuriosityExperience object for the frontend.
 *
 * Placeholder: the real DB mapping is not implemented yet.
 * Phase 4.2+ will implement the assembly logic.
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";

/** Placeholder input: normalized DB rows. Real types will come from Supabase. */
export type AssembleInput = {
  topic: unknown;
  category: unknown;
  tags: unknown[];
  followups: unknown[];
  quiz: unknown;
  quizOptions: unknown[];
  trails: unknown[];
};

/**
 * Assemble a CuriosityExperience from normalized database rows.
 * Returns null if input is insufficient.
 *
 * TODO: Implement mapping from DB rows to CuriosityExperience.
 */
export async function assembleCuriosityExperience(
  _input: AssembleInput
): Promise<CuriosityExperience | null> {
  // Placeholder: not implemented
  return null;
}
