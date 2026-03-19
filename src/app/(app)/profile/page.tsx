import { redirect } from "next/navigation";
import Link from "next/link";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { getCurrentProfile } from "@/lib/services/user/auth";
import { ProfileProgressHub } from "@/components/profile/profile-progress-hub";
import { ROUTES } from "@/lib/constants/routes";

export default async function ProfilePage() {
  const profile = await getCurrentProfile();

  if (!profile) redirect("/auth/sign-in");

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-gradient-to-b from-violet-50/70 via-slate-50 to-slate-50 dark:from-kuriosa-midnight-blue dark:via-slate-950 dark:to-slate-950">
      <PageContainer className="pb-12 pt-6 sm:pt-10">
        <PageHeader
          title="Profile"
          description="Who you are — and how your curiosity is growing."
        />
        <div className="mt-8">
          <ProfileProgressHub />
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          <Link href={ROUTES.progress} className="font-medium text-kuriosa-electric-cyan hover:underline">
            Full progress dashboard
          </Link>
        </p>
      </PageContainer>
    </div>
  );
}
