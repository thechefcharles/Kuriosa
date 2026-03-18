/**
 * Level curve: XP required to advance from level L → L+1 grows with L.
 * Total XP → current level via cumulative thresholds.
 */

const BASE_XP_PER_TIER = 100;
const LEVEL_EXPONENT = 1.35;

/** XP needed to go from `level` to `level + 1` (level is 1-based). */
export function xpRequiredToAdvanceFromLevel(level: number): number {
  if (level < 1) return xpRequiredToAdvanceFromLevel(1);
  return Math.max(1, Math.round(BASE_XP_PER_TIER * level ** LEVEL_EXPONENT));
}

/** Minimum total XP to be considered at least `level` (level 1 = 0 XP). */
export function cumulativeXpForLevel(level: number): number {
  if (level <= 1) return 0;
  let sum = 0;
  for (let L = 1; L < level; L++) {
    sum += xpRequiredToAdvanceFromLevel(L);
  }
  return sum;
}

/** Level (1-based) for a given lifetime total XP. */
export function getLevelFromXP(totalXp: number): number {
  const xp = Math.max(0, Math.floor(totalXp));
  let level = 1;
  while (cumulativeXpForLevel(level + 1) <= xp) {
    level++;
    if (level > 1_000_000) break;
  }
  return level;
}

/** XP still needed from `totalXp` to reach the next level. */
export function getXPForNextLevel(totalXp: number): number {
  const xp = Math.max(0, Math.floor(totalXp));
  const level = getLevelFromXP(xp);
  const nextThreshold = cumulativeXpForLevel(level + 1);
  return Math.max(0, nextThreshold - xp);
}
