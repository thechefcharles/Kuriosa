/**
 * Dev-only: validates the example CuriosityExperience fixture.
 * Only responds in development. GET /api/dev/validate-curiosity
 */

import { NextResponse } from "next/server";
import { validateExampleCuriosityExperience } from "@/lib/content/validate-example";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }
  const valid = validateExampleCuriosityExperience();
  return NextResponse.json({ valid });
}
