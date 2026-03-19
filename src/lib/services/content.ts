/**
 * Re-exports content loaders. Prefer importing from the specific modules
 * under `content/` when tree-shaking matters.
 *
 * All loaders require a Supabase client (browser or server).
 */

export {
  getDailyCuriosity,
  type DailyCuriosityResult,
} from "@/lib/services/content/get-daily-curiosity";
export {
  getRandomCuriosity,
  type GetRandomCuriosityOptions,
} from "@/lib/services/content/get-random-curiosity";
export {
  loadCuriosityExperience,
  type LoadCuriosityExperienceInput,
} from "@/lib/services/content/load-curiosity-experience";
