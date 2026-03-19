/**
 * Discovery UI view models (Phase 7). Do not use raw DB row shapes in discovery components.
 */

export type CategoryView = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  topicCount?: number;
};

export type TopicCardView = {
  id: string;
  slug: string;
  title: string;
  hook: string;
  categoryName: string;
  categorySlug: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  estimatedMinutes?: number;
  isCompleted?: boolean;
};

export type RecentTopicView = {
  id: string;
  slug: string;
  title: string;
  categoryName: string;
  completedAt?: string;
};

/** Category header + browsable topics (Phase 7.3). */
export type CategoryDetailView = {
  category: CategoryView;
  topics: TopicCardView[];
};
