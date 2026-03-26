"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { clientSignIn } from "@/lib/services/user/auth-client";
import { AUTH_SESSION_USER_ID_QUERY_KEY } from "@/hooks/queries/useAuthUserId";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/lib/constants/routes";

/** Capacitor / device: set `NEXT_PUBLIC_DEBUG_SIGN_IN=1` in `.env.local`, then `npm run build:export`. Remove for release. */
const DEBUG_SIGN_IN = process.env.NEXT_PUBLIC_DEBUG_SIGN_IN === "1";

function SignInForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const router = useRouter();
  const queryClient = useQueryClient();

  async function submitSignIn(formData: FormData) {
    const email = (formData.get("email") as string) ?? "";
    const password = (formData.get("password") as string) ?? "";

    const result = await clientSignIn({ email, password });

    if (!result.ok) {
      setError(result.error);
      return;
    }

    await queryClient.invalidateQueries({ queryKey: AUTH_SESSION_USER_ID_QUERY_KEY });
    const safe =
      redirectTo &&
      redirectTo.startsWith("/") &&
      !redirectTo.startsWith("//");
    const target = safe ? redirectTo : ROUTES.home;
    router.replace(target);
    router.refresh();
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setIsPending(true);
            if (DEBUG_SIGN_IN) {
              window.alert("Sign in clicked");
            }
            try {
              const formData = new FormData(e.currentTarget);
              await submitSignIn(formData);
            } catch (err) {
              const message =
                err instanceof Error ? err.message : String(err);
              setError(message);
              if (DEBUG_SIGN_IN) {
                window.alert(`Sign in threw: ${message}`);
              }
            } finally {
              setIsPending(false);
            }
          }}
        >
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.signUp} className="text-primary underline">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Loading…</p>
          </CardContent>
        </Card>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
