"use client";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import type { SupportedLocale } from "@/domain/shared/types";
import {
  usePathname,
  useRouter,
} from "@/i18n/navigation";

const supportedLocales: readonly SupportedLocale[] = [
  "tr",
  "en",
];

export function LocaleSwitcher() {
  const locale = useLocale() as SupportedLocale;
  const pathname = usePathname();
  const router = useRouter();

  const t = useTranslations("Common");

  function changeLocale(
    nextLocale: SupportedLocale,
  ) {
    if (nextLocale === locale) {
      return;
    }

    router.replace(pathname, {
      locale: nextLocale,
    });
  }

  return (
    <div
      role="group"
      aria-label={t("languageSwitcher")}
      className="flex items-center rounded-lg border border-border bg-surface p-1"
    >
      {supportedLocales.map(
        (supportedLocale) => {
          const active =
            supportedLocale === locale;

          return (
            <button
              key={supportedLocale}
              type="button"
              onClick={() =>
                changeLocale(
                  supportedLocale,
                )
              }
              aria-pressed={active}
              className={[
                "min-h-8 rounded-md px-2.5 text-xs font-semibold transition-colors",
                active
                  ? "bg-brand text-white"
                  : "text-muted-strong hover:bg-surface-subtle hover:text-foreground",
              ].join(" ")}
            >
              {supportedLocale.toUpperCase()}
            </button>
          );
        },
      )}
    </div>
  );
}