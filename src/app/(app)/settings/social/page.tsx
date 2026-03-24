import { redirect } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { PrivacySettings } from "@/components/social/privacy-settings";
import { getCurrentUser } from "@/lib/services/user/auth";

export default async function SocialSettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/60 via-slate-50 to-slate-50 dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950">
      <PageContainer className="pb-12 pt-6 sm:pt-10">
        <PageHeader
          title="Social & privacy"
          description="Control how much of your curiosity journey is visible to others."
        />
        <div className="mt-8">
          <PrivacySettings />
        </div>
      </PageContainer>
    </div>
  );
}
