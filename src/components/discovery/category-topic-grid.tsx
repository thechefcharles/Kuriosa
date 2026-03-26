import type { TopicCardView } from "@/types/discovery";
import { TopicCard } from "@/components/discovery/topic-card";
import { MOBILE_SAFE_ROUTES } from "@/lib/constants/routes";

export function CategoryTopicGrid({ topics }: { topics: TopicCardView[] }) {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {topics.map((t) => (
        <li key={t.id}>
          <TopicCard
            topic={t}
            href={MOBILE_SAFE_ROUTES.curiosityFromDiscover(t.slug)}
          />
        </li>
      ))}
    </ul>
  );
}
