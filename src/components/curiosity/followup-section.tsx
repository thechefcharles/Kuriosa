"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageCircleQuestion } from "lucide-react";
import type { CuriosityFollowup } from "@/types/curiosity-experience";
import { FollowupCard } from "@/components/curiosity/followup-card";
import { ROUTES } from "@/lib/constants/routes";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_FOLLOWUPS = 5;

export function FollowupSection({
  followups,
  rawFollowupCount,
}: {
  followups: CuriosityFollowup[];
  /** Total before filtering empty questions — for clearer empty state */
  rawFollowupCount?: number;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const list = followups.slice(0, MAX_FOLLOWUPS);
  const raw = rawFollowupCount ?? followups.length;

  if (list.length === 0) {
    const awaitingContent = raw > 0;
    return (
      <div className="rounded-xl border border-dashed border-muted-foreground/25 bg-muted/15 px-4 py-7 text-center sm:px-6">
        <MessageCircleQuestion
          className="mx-auto mb-3 h-9 w-9 text-muted-foreground/70"
          aria-hidden
        />
        <p className="text-sm font-medium text-kuriosa-midnight-blue dark:text-slate-200">
          {awaitingContent
            ? "Questions are on their way"
            : "No extra questions yet"}
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          {awaitingContent
            ? "They’ll appear here once the lesson is fully wired. Explore the next curiosity below."
            : "Dig deeper on another topic — Discover has plenty."}
        </p>
        <Link
          href={ROUTES.discover}
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "mt-5 border-kuriosa-electric-cyan/40"
          )}
        >
          Browse Discover
        </Link>
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
