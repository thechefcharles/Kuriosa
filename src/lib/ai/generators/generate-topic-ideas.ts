/**
 * Topic idea generation service.
 * Calls OpenAI, uses prompt builder, parses and validates response.
 */

import { getOpenAIClient } from "@/lib/ai/openai-client";
import { buildTopicIdeaMessages } from "@/lib/ai/prompts/topic-idea-prompts";
import { parseTopicIdeasResponse } from "@/lib/ai/parsers/topic-idea-parser";
import type { TopicIdeaCandidate } from "@/types/content-generation";

export interface GenerateTopicIdeasOptions {
  category: string;
  subcategory?: string;
  audience?: string;
  tone?: string;
  difficulty?: string;
  count?: number;
  excludeTitles?: string[];
}

export type GenerateTopicIdeasResult =
  | { success: true; ideas: TopicIdeaCandidate[] }
  | { success: false; error: string; details?: unknown };

const DEFAULT_MODEL = "gpt-4o-mini";

/**
 * Generate topic ideas via OpenAI.
 * Server-side only. Requires OPENAI_API_KEY.
 */
export async function generateTopicIdeas(
  options: GenerateTopicIdeasOptions
): Promise<GenerateTopicIdeasResult> {
  try {
    const client = getOpenAIClient();
    const messages = buildTopicIdeaMessages(options);

    const response = await client.chat.completions.create({
      model: DEFAULT_MODEL,
      messages,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      return {
        success: false,
        error: "Empty or invalid API response",
        details: response,
      };
    }

    const parseResult = parseTopicIdeasResponse(content);
    if (!parseResult.success) {
      return {
        success: false,
        error: parseResult.error,
        details: parseResult.details,
      };
    }

    if (parseResult.ideas.length === 0) {
      return {
        success: false,
        error: "No ideas in response",
      };
    }

    return {
      success: true,
      ideas: parseResult.ideas,
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("OPENAI_API_KEY")) {
        return { success: false, error: err.message };
      }
      return {
        success: false,
        error: err.message,
        details: err,
      };
    }
    return {
      success: false,
      error: "Unknown error during topic idea generation",
      details: err,
    };
  }
}
