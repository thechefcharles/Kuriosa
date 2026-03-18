"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { ROUTES } from "@/lib/constants/routes";
import { Button } from "@/components/ui/button";
import { useRecordCuriosityCompletion } from "@/hooks/mutations/useRecordCuriosityCompletion";
import { getTopicDiscoveryContext } from "@/lib/services/progress/session-topic-discovery";
import { getModeUsedLabel } from "@/lib/services/progress/session-curiosity-modes";
import { cn } from "@/lib/utils";

/**
 * Records completion when the user leaves the challenge for post-challenge exploration.
 * See PHASE_5_CORE_UX_INVENTORY.md — completion trigger.
 */
export function ChallengeContinueExploringButton({
  slug,
  topicId,
  challengeCorrect,
}: {
  slug: string;
  topicId: string;
  challengeCorrect: boolean;
}) {
  const router = useRouter();
  const { mutateAsync, isPending } = useRecordCuriosityCompletion();
  const [syncMissed, setSyncMissed] = useState(false);

  const handleClick = async () => {
    setSyncMissed(false);
    try {
      const { wasDailyFeature, wasRandomSpin } = getTopicDiscoveryContext(slug);
      const res = await mutateAsync({
        topicId,
        modeUsed: getModeUsedLabel(slug),
        challengeCorrect,
        wasDailyFeature,
        wasRandomSpin,
      });
      if (!res.ok) setSyncMissed(true);
    } catch {
      setSyncMissed(true);
    } finally {
      router.push(`${ROUTES.curiosity(slug)}#whats-next`);
    }
  };

  return (
    <div className="w-full sm:w-auto">
      <Button
        type="button"
        size="lg"
        disabled={isPending}
        className={cn(
          "inline-flex min-h-12 w-full items-center justify-center gap-2 sm:w-auto"
        )}
        onClick={() => void handleClick()}
      >
        {isPending ? (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden
            />
            Saving…
          </span>
        ) : (
          <>
            <Sparkles className="h-4 w-4" aria-hidden />
            Continue exploring
          </>
        )}
      </Button>
      {syncMissed ? (
        <p className="mt-1 text-center text-xs text-muted-foreground sm:text-left" role="status">
          Progress didn&apos;t sync — you can still explore. Try again later if it matters.
        </p>
      ) : null}
    </div>
  );
}
