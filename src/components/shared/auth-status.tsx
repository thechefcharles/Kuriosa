"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { supabaseBrowser } from "@/lib/supabase/supabase-browser-client";
import type { User } from "@supabase/supabase-js";
import { clientSignOut } from "@/lib/services/user/auth-client";
import { AUTH_SESSION_USER_ID_QUERY_KEY } from "@/hooks/queries/useAuthUserId";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export function AuthStatus() {
  const [user, setUser] = useState<User | null>(null);
  const [signOutPending, setSignOutPending] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data: { user } }) => setUser(user));
    const {
      data: { subscription },
    } = supabaseBrowser.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    setSignOutPending(true);
    const result = await clientSignOut();
    setSignOutPending(false);
    if (!result.ok) return;
    await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_USER_ID_QUERY_KEY });
    router.replace(ROUTES.landing);
    router.refresh();
  }

  if (!user) {
    return (
      <Link href={ROUTES.signIn} className="text-sm text-muted-foreground hover:text-foreground">
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="max-w-[120px] truncate text-sm text-muted-foreground">
        {user.email}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={signOutPending}
        onClick={() => void handleSignOut()}
      >
        {signOutPending ? "Signing out…" : "Sign out"}
      </Button>
    </div>
  );
}
