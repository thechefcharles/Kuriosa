"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AIFollowupCard } from "./ai-followup-card";
import { AIAnswerLoading } from "./ai-answer-loading";
import { AIAnswerCard } from "./ai-answer-card";
import { AIAnswerError } from "./ai-answer-error";
import { useAskManualQuestion } from "@/hooks/mutations/useAskManualQuestion";
import type { ManualQuestionResult } from "@/types/ai";
import { cn } from "@/lib/utils";

export function AIFollowupSection({
  followups,
  topicId,
  slug,
  userId,
}: {
  followups: string[];
  topicId: string;
  slug: string;
  userId: string | null;
}) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<{
    question: string;
    result: ManualQuestionResult;
  } | null>(null);

  const askQuestion = useAskManualQuestion();

  const onToggleFollowup = (question: string) => {
    const next = expandedQuestion === question ? null : question;
    setExpandedQuestion(next);

    if (next) {
      setAnswerState(null);
      if (!userId) return;
      askQuestion.mutate(
        { slug, topicId, questionText: question },
        {
          onSuccess: (result) => {
            setAnswerState({ question: next, result });
          },
        }
      );
    }
  };

  if (followups.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-200/70 pb-2 dark:border-white/10">
        <Sparkles
          className="h-5 w-5 text-kuriosa-electric-cyan"
          aria-hidden
        />
        <h3 className="text-sm font-bold uppercase tracking-wide text-kuriosa-deep-purple dark:text-kuriosa-electric-cyan">
          Go deeper with AI
        </h3>
        <span className="text-xs font-normal normal-case text-muted-foreground">
          — tap to ask
        </span>
      </div>

      <div className="space-y-3">
        {followups.map((q) => {
          const expanded = expandedQuestion === q;
          const stateForThis = answerState?.question === q ? answerState.result : null;

          const answerSlot = !userId ? (
            <div className="rounded-lg border border-dashed border-violet-200/60 bg-violet-50/30 px-3 py-3 text-sm text-muted-foreground dark:border-white/10 dark:bg-violet-950/20">
              Sign in to ask questions and get AI answers.
            </div>
          ) : askQuestion.isPending && expanded && !stateForThis ? (
            <AIAnswerLoading />
          ) : stateForThis?.ok === false ? (
            <AIAnswerError
              result={stateForThis}
              onRetry={() =>
                askQuestion.mutate(
                  { slug, topicId, questionText: q },
                  { onSuccess: (r) => setAnswerState({ question: q, result: r }) }
                )
              }
            />
          ) : stateForThis?.ok ? (
            <AIAnswerCard
              question={stateForThis.question}
              answerText={stateForThis.answerText}
            />
          ) : null;

          return (
            <AIFollowupCard
              key={q}
              question={q}
              expanded={expanded}
              onToggle={() => onToggleFollowup(q)}
              answerSlot={answerSlot}
            />
          );
        })}
      </div>
    </div>
  );
}
