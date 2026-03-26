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
    <div className="space-y-4">
      <div className="rounded-xl border border-violet-200/60 bg-violet-50/30 px-4 py-3 dark:border-violet-800/40 dark:bg-violet-950/20">
        <p className="text-sm font-medium text-foreground">
          Want a quick bonus?
        </p>
        <Button
          type="button"
          variant="outline"
          size="default"
          className="mt-2 h-10 gap-2"
          onClick={onTryBonus}
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Try bonus
        </Button>
      </div>
      <div className="border-t border-slate-200/60 pt-4 dark:border-white/10">
        {onContinue}
      </div>
    </div>
  );
}
