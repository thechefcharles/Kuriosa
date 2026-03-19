import { ChallengeScreen } from "@/components/challenge/challenge-screen";
import { PageContainer } from "@/components/shared/page-container";
import { cn } from "@/lib/utils";

interface ChallengePageProps {
  params: Promise<{ slug: string }>;
}

export default async function ChallengePage({ params }: ChallengePageProps) {
  const { slug } = await params;

  return (
    <div
      className={cn(
        "min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/90 via-slate-50 to-slate-50",
        "dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950"
      )}
    >
      <PageContainer className="pb-12 pt-6 sm:pt-8">
        <ChallengeScreen slug={slug} />
      </PageContainer>
    </div>
  );
}
