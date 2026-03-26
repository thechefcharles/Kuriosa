import { PageContainer } from "@/components/shared/page-container";
import { ProfileScreen } from "@/components/social/profile-screen";

interface ProfilePageProps {
  params: Promise<{ userId: string }>;
}

export default async function PublicProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params;

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/60 via-slate-50 to-slate-50 dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950">
      <PageContainer className="pb-12 pt-6 sm:pt-10">
        <ProfileScreen userId={userId} />
      </PageContainer>
    </div>
  );
}
