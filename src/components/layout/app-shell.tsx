import { TopBar } from "./top-bar";
import { BottomNavigation } from "./bottom-navigation";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <TopBar />
      <main className="flex-1 pb-20">{children}</main>
      <BottomNavigation />
    </div>
  );
}
