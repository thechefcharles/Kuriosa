import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { ProgressDataVerificationPanel } from "@/components/progress/progress-data-verification-panel";

export default function ProgressPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Progress"
        description="XP, streaks, badges, and curiosity score — data layer preview (6.4)."
      />
      <div className="mt-6">
        <ProgressDataVerificationPanel />
      </div>
    </PageContainer>
  );
}
