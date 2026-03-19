/**
 * Validates the example CuriosityExperience fixture.
 * Import and call validateExampleCuriosityExperience() to verify the example passes Zod.
 */

import { exampleCuriosityExperience } from "./example-curiosity-experience";
import { safeParseCuriosityExperience } from "@/lib/validations/parse-curiosity-experience";

export function validateExampleCuriosityExperience(): boolean {
  const result = safeParseCuriosityExperience(exampleCuriosityExperience);
  if (result.success) {
    return true;
  }
  console.error("Validation failed:", result.error);
  return false;
}
