import { PublicShell } from "@/components/shells/public-shell";

interface PublicLayoutProps {
  readonly children: React.ReactNode;
}

export default function PublicLayout({
  children,
}: PublicLayoutProps) {
  return (
    <PublicShell>
      {children}
    </PublicShell>
  );
}