"use client";

import { useProfilePrivacy } from "@/hooks/queries/useProfilePrivacy";
import { useUpdatePrivacySettings } from "@/hooks/mutations/useUpdatePrivacySettings";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { cn } from "@/lib/utils";

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
  disabled,
}: ToggleRowProps) {
  return (
    <label
      className={cn(
        "flex items-start justify-between gap-4 rounded-xl border border-slate-200/80 bg-white/80 px-4 py-4 dark:border-white/10 dark:bg-slate-900/40",
        disabled && "opacity-60"
      )}
    >
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="relative mt-1 inline-block shrink-0">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="peer sr-only"
        />
        <span
          className={cn(
            "relative block h-5 w-9 cursor-pointer rounded-full bg-slate-200 transition-colors peer-checked:bg-violet-500 peer-disabled:cursor-not-allowed dark:bg-slate-700 dark:peer-checked:bg-violet-500",
            "before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:shadow before:transition-transform before:content-[''] peer-checked:before:translate-x-4"
          )}
          aria-hidden
        />
      </div>
    </label>
  );
}

export function PrivacySettings() {
  const { data: settings, isPending, isError, error } = useProfilePrivacy();
  const mutation = useUpdatePrivacySettings();

  if (isPending || !settings) return <LoadingState />;
  if (isError) {
    return (
      <ErrorState
        message={error?.message ?? "Couldn't load privacy settings."}
      />
    );
  }

  const update = (key: keyof typeof settings, value: boolean) => {
    mutation.mutate({ [key]: value });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Control how much of your curiosity journey is visible to others.
      </p>

      <div className="space-y-3">
        <ToggleRow
          label="Public profile"
          description="Let others see your profile page and curiosity stats"
          checked={settings.isPublicProfile}
          onChange={(v) => update("isPublicProfile", v)}
          disabled={mutation.isPending}
        />
        <ToggleRow
          label="Activity feed"
          description="Show your activity in the community feed"
          checked={settings.allowActivityFeed}
          onChange={(v) => update("allowActivityFeed", v)}
          disabled={mutation.isPending}
        />
        <ToggleRow
          label="Leaderboard"
          description="Include you in community leaderboards"
          checked={settings.allowLeaderboard}
          onChange={(v) => update("allowLeaderboard", v)}
          disabled={mutation.isPending}
        />
      </div>

      {mutation.isError && (
        <p className="text-sm text-destructive">
          {mutation.error?.message}
        </p>
      )}
    </div>
  );
}
