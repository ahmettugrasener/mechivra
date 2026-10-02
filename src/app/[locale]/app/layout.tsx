import { AppShell } from "@/components/shells/app-shell";

interface AppLayoutProps {
  readonly children: React.ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <AppShell>
      {children}
    </AppShell>
  );
}