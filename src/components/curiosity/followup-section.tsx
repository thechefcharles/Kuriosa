"use client";

import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import type { CuriosityFollowup } from "@/types/curiosity-experience";
import { FollowupCard } from "@/components/curiosity/followup-card";

const MAX_FOLLOWUPS = 5;

export function FollowupSection({ followups }: { followups: CuriosityFollowup[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const list = followups.slice(0, MAX_FOLLOWUPS);

  if (list.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/20 px-4 py-6 text-center">
        <MessageCircleQuestion
          className="mx-auto mb-2 h-8 w-8 text-muted-foreground/70"
          aria-hidden
        />
        <p className="text-sm text-muted-foreground">
          No follow-up questions yet — check back as this curiosity grows.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {list.map((f) => {
        const regionId = `followup-answer-${f.id}`;
        return (
          <FollowupCard
            key={f.id}
            followup={f}
            expanded={openId === f.id}
            onToggle={() => setOpenId((id) => (id === f.id ? null : f.id))}
            answerRegionId={regionId}
          />
        );
      })}
    </div>
  );
}
