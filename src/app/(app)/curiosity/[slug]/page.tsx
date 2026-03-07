import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";

interface CuriosityPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CuriosityPage({ params }: CuriosityPageProps) {
  const { slug } = await params;

  return (
    <PageContainer>
      <PageHeader
        title="Curiosity"
        description={`Topic: ${slug}`}
      />
    </PageContainer>
  );
}
