import { createClient, type User } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/supabase-server-client";

/**
 * Resolves the signed-in user for a Route Handler: cookies (web) first, then
 * `Authorization: Bearer <access_token>` (Capacitor / cross-origin static shell → hosted API).
 */
export async function getUserForApiRoute(request: Request): Promise<User | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) return user;

  const raw = request.headers.get("authorization");
  const jwt = raw?.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
  if (!jwt) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  const anon = createClient(url, anonKey);
  const {
    data: { user: jwtUser },
    error,
  } = await anon.auth.getUser(jwt);
  if (error || !jwtUser) return null;
  return jwtUser;
}
