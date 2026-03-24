"use client";

import type { PublicProfileView } from "@/types/social";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: PublicProfileView;
}

function displayName(p: PublicProfileView): string {
  return p.displayName?.trim() || "Explorer";
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const name = displayName(profile);

  return (
    <div className="flex flex-col items-center text-center">
      <div
        className={cn(
          "flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-200 to-violet-400/80 text-2xl font-bold text-white shadow-lg dark:from-violet-700 dark:to-violet-900"
        )}
      >
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-hidden>{name.slice(0, 2).toUpperCase() || "?"}</span>
        )}
      </div>
      <h1 className="mt-4 text-xl font-semibold text-foreground">{name}</h1>
      {profile.bio?.trim() && (
        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          {profile.bio.trim()}
        </p>
      )}
    </div>
  );
}
