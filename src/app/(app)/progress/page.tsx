import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

export default function ProgressPage() {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/80 via-slate-50 to-slate-50 dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950">
      <PageContainer className="pb-12 pt-6 sm:pt-10">
        <PageHeader
          title="Progress"
          description="Your curiosity is growing — level up, earn badges, and keep the streak alive."
        />
        <div className="mt-8">
          <ProgressDashboard />
        </div>
      </PageContainer>
    </div>
  );
}
