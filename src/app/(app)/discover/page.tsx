"use client";

import { useTopics } from "@/hooks/queries/useTopics";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";

export default function DiscoverPage() {
  const { data, isLoading } = useTopics();

  return (
    <PageContainer>
      <PageHeader
        title="Discover"
        description="Feed your curiosity — explore topics and trails."
      />
      {isLoading ? (
        <LoadingState />
      ) : (
        <p className="text-sm text-muted-foreground">
          {data.length === 0 ? "No topics yet." : `${data.length} topics`}
        </p>
      )}
    </PageContainer>
  );
}
