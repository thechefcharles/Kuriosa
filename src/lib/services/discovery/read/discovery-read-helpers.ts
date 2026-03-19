import type {
  CategoryView,
  TopicCardView,
} from "@/types/discovery";

type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
};

export function mapCategoryToCategoryView(
  row: CategoryRow,
  topicCount?: number
): CategoryView {
  const desc = row.description?.trim();
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    ...(desc ? { description: desc } : {}),
    ...(typeof topicCount === "number" ? { topicCount } : {}),
  };
}

function normalizeDifficulty(
  raw: string | null | undefined
): TopicCardView["difficulty"] | undefined {
  if (!raw?.trim()) return undefined;
  const s = raw.trim().toLowerCase();
  if (s === "beginner" || s === "easy") return "beginner";
  if (s === "intermediate") return "intermediate";
  if (s === "advanced" || s === "expert") return "advanced";
  return undefined;
}

type TopicCardRow = {
  id: string;
  slug: string;
  title: string;
  hook_text?: string | null;
  difficulty_level?: string | null;
  estimated_minutes?: number | null;
  categories?: { slug: string; name: string } | null;
};

export function mapTopicToTopicCardView(
  row: TopicCardRow,
  opts?: {
    categoryName?: string;
    categorySlug?: string;
    isCompleted?: boolean;
  }
): TopicCardView | null {
  if (!row?.id || !row.slug || !row.title) return null;

  const cat = row.categories;
  const categoryName =
    opts?.categoryName ?? cat?.name?.trim() ?? "Curiosity";
  const categorySlug = opts?.categorySlug ?? cat?.slug?.trim() ?? "unknown";

  const hook = (row.hook_text ?? "").trim() || "Open to find out.";

  const em =
    row.estimated_minutes != null && Number.isFinite(Number(row.estimated_minutes))
      ? Math.max(1, Math.round(Number(row.estimated_minutes)))
      : undefined;

  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title).trim(),
    hook: hook.slice(0, 220),
    categoryName,
    categorySlug,
    difficulty: normalizeDifficulty(row.difficulty_level),
    estimatedMinutes: em,
    ...(opts?.isCompleted !== undefined ? { isCompleted: opts.isCompleted } : {}),
  };
}
