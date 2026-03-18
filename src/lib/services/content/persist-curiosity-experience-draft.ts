/**
 * Persist a validated CuriosityExperience into normalized Supabase tables.
 * Requires SUPABASE_SERVICE_ROLE_KEY (bypasses RLS).
 */

import type { CuriosityExperience } from "@/types/curiosity-experience";
import type { PersistCuriosityExperienceResult } from "@/types/content-persistence";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { safeValidateCuriosityExperienceDraft } from "@/lib/validations/assembled-curiosity-draft";
import { mapDraftToTopicRow } from "@/lib/services/content/map-draft-to-topic-row";
import { mapDraftToFollowupRows } from "@/lib/services/content/map-draft-to-followup-rows";
import { mapDraftToPrimaryQuiz } from "@/lib/services/content/map-draft-to-quiz-rows";
import { partitionTrailsByResolution } from "@/lib/services/content/map-draft-to-trail-rows";

function normalizeTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .slice(0, 48);
}

async function resolveCategoryId(
  categorySlug: string,
  categoryLabel: string
): Promise<string | null> {
  const supabase = getSupabaseServiceRoleClient();
  const { data: bySlug } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .maybeSingle();
  if (bySlug?.id) return bySlug.id as string;

  const { data: byName } = await supabase
    .from("categories")
    .select("id")
    .ilike("name", categoryLabel.trim())
    .maybeSingle();
  return (byName?.id as string) ?? null;
}

async function ensureCategoryId(
  categorySlug: string,
  categoryLabel: string
): Promise<{ id: string; created: boolean }> {
  const supabase = getSupabaseServiceRoleClient();
  const existing = await resolveCategoryId(categorySlug, categoryLabel);
  if (existing) return { id: existing, created: false };

  const { data, error } = await supabase
    .from("categories")
    .upsert(
      {
        name: categoryLabel.trim(),
        slug: categorySlug.trim(),
        description: `Auto-created for Phase 4 seeding: ${categoryLabel.trim()}`,
        sort_order: 99,
      },
      { onConflict: "slug" }
    )
    .select("id")
    .single();

  if (error || !data?.id) {
    throw new Error(
      error?.message ??
        `Failed to create missing category (${categorySlug} / ${categoryLabel})`
    );
  }
  return { id: data.id as string, created: true };
}

async function loadTopicIdsBySlug(slugs: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(slugs.filter(Boolean))];
  if (unique.length === 0) return new Map();
  const supabase = getSupabaseServiceRoleClient();
  const { data, error } = await supabase.from("topics").select("id, slug").in("slug", unique);
  if (error || !data) return new Map();
  return new Map(data.map((r: { id: string; slug: string }) => [r.slug, r.id]));
}

/**
 * Upsert topic by slug and replace dependent rows (tags, followups, quiz, trails from this topic).
 */
export async function persistCuriosityExperienceDraft(
  experience: CuriosityExperience
): Promise<PersistCuriosityExperienceResult> {
  const slug = experience.identity.slug;
  const base: PersistCuriosityExperienceResult = {
    success: false,
    topicSlug: slug,
    rowsWritten: {
      topicUpserted: false,
      tags: 0,
      followups: 0,
      quizzes: 0,
      quizOptions: 0,
      trails: 0,
    },
    warnings: [],
    unresolvedTrails: [],
  };

  const validated = safeValidateCuriosityExperienceDraft(experience);
  if (!validated.success) {
    return {
      ...base,
      error: `Draft validation failed: ${validated.error}`,
    };
  }
  const exp = validated.data;

  try {
    const ensuredCategory = await ensureCategoryId(
      exp.taxonomy.categorySlug,
      exp.taxonomy.category
    );
    if (ensuredCategory.created) {
      base.warnings.push(
        `Category auto-created: ${exp.taxonomy.category} (${exp.taxonomy.categorySlug})`
      );
    }

    const supabase = getSupabaseServiceRoleClient();
    const topicRow = mapDraftToTopicRow(exp, ensuredCategory.id);

    const { data: topicUpsert, error: topicErr } = await supabase
      .from("topics")
      .upsert(topicRow, { onConflict: "slug" })
      .select("id")
      .single();

    if (topicErr || !topicUpsert?.id) {
      return {
        ...base,
        error: topicErr?.message ?? "Topic upsert failed",
      };
    }

    const topicId = topicUpsert.id as string;
    base.rowsWritten.topicUpserted = true;
    base.topicId = topicId;

    await supabase.from("topic_tags").delete().eq("topic_id", topicId);
    const tags = [
      ...new Set(
        exp.taxonomy.tags.map(normalizeTag).filter((t) => t.length > 0)
      ),
    ];
    if (tags.length > 0) {
      const tagRows = tags.map((tag) => ({ topic_id: topicId, tag }));
      const { error: tagErr } = await supabase.from("topic_tags").insert(tagRows);
      if (tagErr) {
        return { ...base, topicId, error: `topic_tags: ${tagErr.message}` };
      }
      base.rowsWritten.tags = tags.length;
    }

    await supabase.from("topic_followups").delete().eq("topic_id", topicId);
    const followRows = mapDraftToFollowupRows(exp).map((r) => ({
      ...r,
      topic_id: topicId,
    }));
    if (followRows.length > 0) {
      const { error: fuErr } = await supabase
        .from("topic_followups")
        .insert(followRows);
      if (fuErr) {
        return { ...base, topicId, error: `topic_followups: ${fuErr.message}` };
      }
      base.rowsWritten.followups = followRows.length;
    }

    await supabase.from("quizzes").delete().eq("topic_id", topicId);

    const { quiz, options } = mapDraftToPrimaryQuiz(exp);
    const { data: quizRow, error: quizErr } = await supabase
      .from("quizzes")
      .insert({
        topic_id: topicId,
        quiz_type: quiz.quiz_type,
        question_text: quiz.question_text,
        explanation_text: quiz.explanation_text,
        difficulty_level: quiz.difficulty_level,
        sort_order: quiz.sort_order,
        memory_recall_hints: quiz.memory_recall_hints,
      })
      .select("id")
      .single();

    if (quizErr || !quizRow?.id) {
      return {
        ...base,
        topicId,
        error: quizErr?.message ?? "Quiz insert failed",
      };
    }
    const quizId = quizRow.id as string;
    base.rowsWritten.quizzes = 1;

    const optionRows = options.map((o) => ({
      quiz_id: quizId,
      option_text: o.option_text,
      is_correct: o.is_correct,
    }));
    if (optionRows.length > 0) {
      const { error: optErr } = await supabase
        .from("quiz_options")
        .insert(optionRows);
      if (optErr) {
        return { ...base, topicId, error: `quiz_options: ${optErr.message}` };
      }
      base.rowsWritten.quizOptions = optionRows.length;
    }

    await supabase.from("topic_trails").delete().eq("from_topic_id", topicId);

    const trailSlugs = exp.trails.map((t) => t.toTopicSlug);
    const slugMap = await loadTopicIdsBySlug(trailSlugs);
    const { resolved, unresolved } = partitionTrailsByResolution(exp, slugMap);
    base.unresolvedTrails = unresolved;
    if (unresolved.length > 0) {
      base.warnings.push(
        `${unresolved.length} trail(s) skipped — target topic slug not found in DB.`
      );
    }

    if (resolved.length > 0) {
      const trailRows = resolved.map((r) => ({
        from_topic_id: topicId,
        to_topic_id: r.to_topic_id,
        reason_text: r.reason_text,
        sort_order: r.sort_order,
      }));
      const { error: trErr } = await supabase.from("topic_trails").insert(trailRows);
      if (trErr) {
        return { ...base, topicId, error: `topic_trails: ${trErr.message}` };
      }
      base.rowsWritten.trails = trailRows.length;
    }

    base.success = true;
    return base;
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ...base, error: msg };
  }
}
