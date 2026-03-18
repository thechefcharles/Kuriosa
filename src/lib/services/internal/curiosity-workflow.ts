/**
 * Internal content workflow actions for Phase 4.10.
 * These functions update normalized topic rows based on moderation/review status.
 */

import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import type {
  CuriosityContentSourceType,
  CuriosityReviewStatus,
} from "@/types/curiosity-experience";
import { loadCuriosityPreviewBySlug } from "@/lib/services/content/load-curiosity-preview";

export type WorkflowActionStatus =
  | "reviewed"
  | "published"
  | "rejected"
  | "archived";

export type InternalWorkflowResult =
  | {
      success: true;
      topicId: string;
      topicSlug: string;
      status: WorkflowActionStatus;
    }
  | { success: false; error: string };

function mapStatusToReviewStatus(status: WorkflowActionStatus): CuriosityReviewStatus {
  // Keep these aligned with CuriosityReviewStatus + topics.status.
  return status;
}

function defaultSourceTypeForEditorial(): CuriosityContentSourceType {
  return "ai_generated_editor_reviewed";
}

async function setTopicStatusBySlug(
  topicSlug: string,
  status: WorkflowActionStatus
): Promise<InternalWorkflowResult> {
  const supabase = getSupabaseServiceRoleClient();

  const nextSourceType = defaultSourceTypeForEditorial();

  const { data, error } = await supabase
    .from("topics")
    .update({
      status,
      source_type: nextSourceType,
      updated_at: new Date().toISOString(),
    })
    .eq("slug", topicSlug)
    .select("id, slug, status")
    .maybeSingle();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Topic update failed" };
  }

  return {
    success: true,
    topicId: String(data.id),
    topicSlug: String(data.slug),
    status: status,
  };
}

export async function previewCuriosityDraft(
  topicSlug: string
): Promise<ReturnType<typeof loadCuriosityPreviewBySlug>> {
  return loadCuriosityPreviewBySlug(topicSlug);
}

export async function markCuriosityAsReviewed(
  topicSlug: string
): Promise<InternalWorkflowResult> {
  return setTopicStatusBySlug(topicSlug, "reviewed");
}

export async function publishCuriosityBySlug(
  topicSlug: string
): Promise<InternalWorkflowResult> {
  return setTopicStatusBySlug(topicSlug, "published");
}

export async function rejectCuriosityBySlug(
  topicSlug: string
): Promise<InternalWorkflowResult> {
  return setTopicStatusBySlug(topicSlug, "rejected");
}

export async function archiveCuriosityBySlug(
  topicSlug: string
): Promise<InternalWorkflowResult> {
  return setTopicStatusBySlug(topicSlug, "archived");
}

export { mapStatusToReviewStatus };

