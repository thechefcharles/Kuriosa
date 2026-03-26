import { PageContainer } from "@/components/shared/page-container";
import { ProfileScreen } from "@/components/social/profile-screen";

/**
 * Shared shell for public profile views — used by `/profile/[userId]` and `/profile?userId=`.
 */
export function PublicProfileLayout({ userId }: { userId: string }) {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/60 via-slate-50 to-slate-50 dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950">
      <PageContainer className="pb-12 pt-6 sm:pt-10">
        <ProfileScreen userId={userId} />
      </PageContainer>
    </div>
  );
}
