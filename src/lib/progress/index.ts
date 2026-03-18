/**
 * Single entry for progress math. Import from here or specific modules — avoid duplicating formulas.
 */

export { XP_CONFIG } from "@/lib/progress/xp-config";
export {
  getLevelFromXP,
  getXPForNextLevel,
  cumulativeXpForLevel,
  xpRequiredToAdvanceFromLevel,
} from "@/lib/progress/level-config";
export { calculateCuriosityScore } from "@/lib/progress/curiosity-score";
export {
  isSameDay,
  isYesterday,
  calculateNextStreak,
  parseUtcDateOnly,
} from "@/lib/progress/streak-utils";
export { calculateRewards } from "@/lib/progress/calculate-rewards";
