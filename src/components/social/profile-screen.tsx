"use client";

import { usePublicProfile } from "@/hooks/queries/usePublicProfile";
import { useAuthUserId } from "@/hooks/queries/useAuthUserId";
import { useUserProgressSummary } from "@/hooks/queries/useUserProgressSummary";
import { ProfileHeader } from "./profile-header";
import { ProfileStats } from "./profile-stats";
import { ProfileBadges } from "./profile-badges";
import { ProfileTopics } from "./profile-topics";
import { ProfilePrivate } from "./profile-private";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";

interface ProfileScreenProps {
  userId: string;
}

export function ProfileScreen({ userId }: ProfileScreenProps) {
  const { data: currentUserId } = useAuthUserId();
  const { data: currentSummary } = useUserProgressSummary();
  const { data: result, isPending, isError, error } = usePublicProfile(userId);

  if (isPending) return <LoadingState />;

  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? "Something went wrong loading this profile."}
      />
    );
  }

  if (!result || !result.ok) {
    if (result?.notFound) {
      return (
        <div className="rounded-xl border border-dashed border-slate-200/80 bg-slate-50/50 px-6 py-12 text-center dark:border-white/10 dark:bg-slate-900/30">
          <p className="text-sm text-muted-foreground">Profile not found.</p>
        </div>
      );
    }
    return <ProfilePrivate />;
  }

  const { profile, badges, recentTopics } = result.data;
  const isOwnProfile = currentUserId === userId;
  const currentUserStats =
    !isOwnProfile && currentSummary
      ? {
          curiosityScore: currentSummary.curiosityScore,
          level: currentSummary.currentLevel,
          topicsExploredCount: 0,
          badgesCount: 0,
        }
      : undefined;

  return (
    <div className="space-y-6">
      <ProfileHeader profile={profile} />
      <ProfileStats
        profile={profile}
        currentUserStats={currentUserStats}
      />
      <ProfileBadges badges={badges} />
      <ProfileTopics
        topics={recentTopics}
        totalCount={profile.topicsExploredCount}
      />
    </div>
  );
}
