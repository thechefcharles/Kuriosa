"use client";

import { Compass } from "lucide-react";
import { RabbitHoleCard } from "./rabbit-hole-card";
import type { TopicRabbitHoleItem } from "@/types/ai";
import { cn } from "@/lib/utils";

export function RabbitHoleSection({
  rabbitHoles,
  onSelectRabbitHole,
  className,
}: {
  rabbitHoles: TopicRabbitHoleItem[];
  onSelectRabbitHole: (item: TopicRabbitHoleItem) => void;
  className?: string;
}) {
  if (rabbitHoles.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2 dark:border-white/10">
        <Compass
          className="h-5 w-5 text-kuriosa-electric-cyan"
          aria-hidden
        />
        <h3 className="text-sm font-bold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
          Keep exploring
        </h3>
        <span className="text-xs font-normal normal-case text-muted-foreground">
          — suggested next
        </span>
      </div>

      <ul className="space-y-3" role="list">
        {rabbitHoles.map((item, i) => (
          <li key={`${item.title}-${i}`}>
            <RabbitHoleCard
              title={item.title}
              reasonText={item.reasonText}
              onSelect={() => onSelectRabbitHole(item)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
