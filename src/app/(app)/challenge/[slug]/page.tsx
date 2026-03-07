import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;

  return (
    <PageContainer>
      <PageHeader
        title="Challenge"
        description={`Quiz for topic: ${slug}`}
      />
    </PageContainer>
  );
}
