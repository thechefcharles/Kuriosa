"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/shared/page-container";
import { PageHeader } from "@/components/shared/page-header";
import { ProfileProgressHub } from "@/components/profile/profile-progress-hub";
import { PublicProfileLayout } from "@/components/social/public-profile-layout";
import { ROUTES } from "@/lib/constants/routes";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";

/**
 * Own hub: `/profile`. Public view (mobile-safe): `/profile?userId=…` reuses the same screen as
 * `/profile/[userId]`. Auth: `ProtectedAppRoute` skips gate for `userId` query (see `profile-access.ts`).
 */
function ProfilePageContent() {
  const searchParams = useSearchParams();
  const publicUserId = searchParams.get("userId")?.trim();

  if (publicUserId) {
    return <PublicProfileLayout userId={publicUserId} />;
  }

  return <OwnProfileHub />;
}

function OwnProfileHub() {
  const { data: userId, isPending } = useAuthUserId();

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
        {!isPending && userId ? (
          <div className="mt-10 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
            <Link
              href={ROUTES.progress}
              className="font-medium text-kuriosa-electric-cyan hover:underline"
            >
              Full progress dashboard
            </Link>
            <span>·</span>
            <Link
              href={ROUTES.profilePublic(userId)}
              className="font-medium text-kuriosa-electric-cyan hover:underline"
            >
              View public profile
            </Link>
            <span>·</span>
            <Link
              href={ROUTES.settingsSocial}
              className="font-medium text-kuriosa-electric-cyan hover:underline"
            >
              Privacy settings
            </Link>
          </div>
        ) : null}
      </PageContainer>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      }
    >
      <ProfilePageContent />
    </Suspense>
  );
}
