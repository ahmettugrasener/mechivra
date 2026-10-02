import { useTranslations } from "next-intl";

import { LocaleSwitcher } from "@/components/locale-switcher";
import { ButtonLink } from "@/components/ui/button-link";
import { PageContainer } from "@/components/ui/page-container";
import { publicNavigation } from "@/features/navigation/navigation";
import { Link } from "@/i18n/navigation";

interface PublicShellProps {
  readonly children: React.ReactNode;
}

export function PublicShell({
  children,
}: PublicShellProps) {
  const navigationT =
    useTranslations("Navigation");

  const commonT =
    useTranslations("Common");

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-surface/95 backdrop-blur">
        <PageContainer className="flex min-h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-[-0.03em]"
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

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {publicNavigation.map(
              (item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-muted-strong transition-colors hover:text-foreground"
                >
                  {navigationT(
                    item.labelKey,
                  )}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitcher />

            <ButtonLink
              href="/app"
              className="hidden sm:inline-flex"
            >
              {commonT(
                "startLearning",
              )}
            </ButtonLink>
          </div>
        </PageContainer>
      </header>

      <main>{children}</main>

      <footer className="mt-24 border-t border-border bg-surface">
        <PageContainer className="flex flex-col gap-5 py-8 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-semibold text-foreground">
              {commonT("brand")}
            </p>

            <p className="mt-1">
              {commonT("tagline")}
            </p>
          </div>

          <nav
            aria-label="Footer navigation"
            className="flex flex-wrap gap-5"
          >
            <Link
              href="/support"
              className="hover:text-foreground"
            >
              {commonT("support")}
            </Link>

            <Link
              href="/privacy"
              className="hover:text-foreground"
            >
              {commonT("privacy")}
            </Link>

            <Link
              href="/terms"
              className="hover:text-foreground"
            >
              {commonT("terms")}
            </Link>
          </nav>
        </PageContainer>
      </footer>
    </div>
  );
}