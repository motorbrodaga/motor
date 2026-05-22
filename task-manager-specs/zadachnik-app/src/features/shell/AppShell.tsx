import { BottomNav } from "@/features/shell/BottomNav";
import { DesktopNav } from "@/features/shell/DesktopNav";
import { ShellHeader } from "@/features/shell/ShellHeader";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <ShellHeader />
        <DesktopNav />
      </aside>
      <main className="app-shell__main">{children}</main>
      <BottomNav />
    </div>
  );
}
