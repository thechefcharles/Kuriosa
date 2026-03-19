/**
 * Normalized DB → CuriosityExperience assembly is implemented in
 * {@link loadCuriosityExperience} (single source of truth for preview + app).
 */

export {
  loadCuriosityExperience,
  type LoadCuriosityExperienceInput,
} from "@/lib/services/content/load-curiosity-experience";
