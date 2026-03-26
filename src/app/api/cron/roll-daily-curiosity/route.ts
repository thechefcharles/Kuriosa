import { NextResponse } from "next/server";
import { getSupabaseServiceRoleClient } from "@/lib/supabase/supabase-service-client";
import { rollDailyCuriosity } from "@/lib/services/content/roll-daily-curiosity";

/**
 * Vercel Cron: sets `daily_curiosity` for the current UTC calendar day.
 * Schedule: `0 0 * * *` (midnight UTC) in vercel.json.
 *
 * Auth: `Authorization: Bearer <CRON_SECRET>` if CRON_SECRET is set, or
 * `x-vercel-cron: 1` on Vercel (automatic for scheduled runs).
 * Optional query: `?date=YYYY-MM-DD` for testing a specific UTC date.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const vercelCron = request.headers.get("x-vercel-cron");

  const authorized =
    (secret != null &&
      secret.length > 0 &&
      auth === `Bearer ${secret}`) ||
    (process.env.VERCEL === "1" && vercelCron === "1");

  if (!authorized) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  let dateISO: string | undefined;
  try {
    const url = new URL(request.url);
    const d = url.searchParams.get("date")?.trim();
    if (d) dateISO = d;
  } catch {
    /* ignore */
  }

  try {
    const supabase = getSupabaseServiceRoleClient();
    const result = await rollDailyCuriosity(supabase, dateISO);
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, message }, { status: 500 });
  }
}
