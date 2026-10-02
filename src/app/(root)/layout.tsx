import type { ReactNode } from "react";

interface RootRedirectLayoutProps {
  readonly children: ReactNode;
}

export default function RootRedirectLayout({
  children,
}: RootRedirectLayoutProps) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}