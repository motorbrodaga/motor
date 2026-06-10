import { BottomNav } from "@/features/shell/BottomNav";
import { DesktopNav } from "@/features/shell/DesktopNav";
import { ShellHeader } from "@/features/shell/ShellHeader";
import { SyncStatus } from "@/features/offline/SyncStatus";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="app-shell__sidebar">
        <ShellHeader />
        <SyncStatus />
        <DesktopNav />
      </aside>
      <main className="app-shell__main">
        <div className="app-shell__mobile-sync">
          <SyncStatus />
        </div>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
