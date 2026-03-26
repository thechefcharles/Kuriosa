import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { LeaderboardScreen } from "@/components/social/leaderboard-screen";
import { ActivityFeed } from "@/components/social/activity-feed";

export default function LeaderboardPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/60 via-slate-50 to-slate-50 dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950">
      <PageContainer className="pb-12 pt-6 sm:pt-10">
        <PageHeader
          title="Community"
          description="Curious people exploring together — see who's discovering this week."
        />
        <div className="mt-8 space-y-12">
          <LeaderboardScreen />
          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              Recent activity
            </h2>
            <ActivityFeed />
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
