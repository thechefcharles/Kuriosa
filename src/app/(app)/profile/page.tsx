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
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
          <Link href={ROUTES.progress} className="font-medium text-kuriosa-electric-cyan hover:underline">
            Full progress dashboard
          </Link>
          <span>·</span>
          <Link href={ROUTES.profilePublic(profile.id)} className="font-medium text-kuriosa-electric-cyan hover:underline">
            View public profile
          </Link>
          <span>·</span>
          <Link href={ROUTES.settingsSocial} className="font-medium text-kuriosa-electric-cyan hover:underline">
            Privacy settings
          </Link>
        </div>
      </PageContainer>
    </div>
  );
}
