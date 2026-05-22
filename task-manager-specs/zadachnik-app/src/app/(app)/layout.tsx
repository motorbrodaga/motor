import { AppShell } from "@/features/shell/AppShell";

export default function ProtectedAppLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
