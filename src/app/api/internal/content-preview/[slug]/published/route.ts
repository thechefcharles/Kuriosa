import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/services/user/auth";
import { assertInternalContentWorkflowAllowed } from "@/lib/services/internal/internal-content-workflow-guard";
import { publishCuriosityBySlug } from "@/lib/services/internal/curiosity-workflow";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    assertInternalContentWorkflowAllowed(user.email);
  } catch {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await publishCuriosityBySlug(slug);
  return NextResponse.json(result, { status: result.success ? 200 : 400 });
}

