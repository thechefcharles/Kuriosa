/**
 * Default XP / level hints for assembled drafts. Tune constants in one place.
 */

import type { CuriosityRewards } from "@/types/curiosity-experience";
import type {
  GeneratedChallengeContent,
  GeneratedLessonContent,
} from "@/types/content-generation";

const DEFAULT_LEVEL_HINT = 1;
const MAX_ASSEMBLED_XP = 150;
const CHALLENGE_XP_WEIGHT = 0.4;

export function defaultCuriosityRewards(
  lesson: GeneratedLessonContent,
  challenge: GeneratedChallengeContent
): CuriosityRewards {
  const lessonXp = Math.max(10, Math.min(80, lesson.xpAward));
  const challengeXp =
    challenge.primaryXpAward != null
      ? Math.max(5, Math.min(50, challenge.primaryXpAward))
      : 15;
  const combined = Math.round(lessonXp + challengeXp * CHALLENGE_XP_WEIGHT);
  return {
    xpAward: Math.min(MAX_ASSEMBLED_XP, combined),
    levelHint: lesson.levelHint ?? DEFAULT_LEVEL_HINT,
  };
}
