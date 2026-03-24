"use client";

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface ChallengeBonusOfferProps {
  onTryBonus: () => void;
  onContinue: React.ReactNode;
}

export function ChallengeBonusOffer({
  onTryBonus,
  onContinue,
}: ChallengeBonusOfferProps) {
  return (
    <div className="rounded-2xl border border-violet-200/70 bg-violet-50/40 p-5 dark:border-violet-800/50 dark:bg-violet-950/30">
      <p className="text-sm font-medium text-foreground">
        Want a quick bonus question?
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        +10 XP if you get it right — optional.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="min-h-12 w-full gap-2 sm:w-auto"
          onClick={onTryBonus}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Try bonus
        </Button>
        {onContinue}
      </div>
    </div>
  );
}
