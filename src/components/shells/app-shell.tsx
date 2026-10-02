import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { PageContainer } from "@/components/ui/page-container";
import { appNavigation } from "@/features/navigation/navigation";
import { Link } from "@/i18n/navigation";

interface AppShellProps {
  readonly children: React.ReactNode;
}

export function AppShell({
  children,
}: AppShellProps) {
  const navigationT =
    useTranslations("Navigation");

  const commonT =
    useTranslations("Common");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <PageContainer className="flex min-h-16 items-center justify-between gap-4">
          <Link
            href="/app"
            className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em]"
          >
            <span
              aria-hidden="true"
              className="grid size-8 place-items-center rounded-lg bg-brand text-sm font-bold text-white"
            >
              M
            </span>

            <span>
              {commonT("brand")}
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <nav
              aria-label="Learning platform navigation"
              className="hidden items-center gap-1 sm:flex"
            >
              {appNavigation.map(
                (item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-muted-strong transition-colors hover:bg-surface-subtle hover:text-foreground"
                  >
                    {navigationT(
                      item.labelKey,
                    )}
                  </Link>
                ),
              )}

              <Link
                href="/app/settings"
                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-strong transition-colors hover:bg-surface-subtle hover:text-foreground"
              >
                {navigationT(
                  "settings",
                )}
              </Link>
            </nav>

            <LocaleSwitcher />
          </div>
        </PageContainer>
      </header>

      <PageContainer className="py-8 lg:py-10">
        {children}
      </PageContainer>
    </div>
  );
}