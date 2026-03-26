import { Suspense } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ProtectedAppRoute } from "@/components/auth/protected-app-route";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="flex min-h-[40vh] items-center justify-center px-4">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </div>
        }
      >
        <ProtectedAppRoute>{children}</ProtectedAppRoute>
      </Suspense>
    </AppShell>
  );
}
