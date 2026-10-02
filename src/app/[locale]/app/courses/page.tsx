import { getLocale } from "next-intl/server";

import {
  getLocalizedText,
  getMvpCatalogItems,
} from "@/content/registry";
import type { SupportedLocale } from "@/domain/shared/types";
import { Link } from "@/i18n/navigation";

export default async function AppCoursesPage() {
  const locale =
    (await getLocale()) as SupportedLocale;

  const catalogItems =
    getMvpCatalogItems();

  return (
    <div>
      <h1 className="text-3xl font-semibold">
        {locale === "tr"
          ? "Dersler"
          : "Courses"}
      </h1>

      <p className="mt-3 max-w-2xl text-muted-strong">
        {locale === "tr"
          ? "Kullanılabilir öğrenme modüllerini incele ve çalışmaya başla."
          : "Explore the available learning modules and begin studying."}
      </p>

      <div className="mt-8 space-y-4">
        {catalogItems.map(
          ({
            course,
            module: moduleItem,
          }) => (
            <Link
              key={moduleItem.id}
              href={`/app/learn/${course.slug}/${moduleItem.slug}`}
              className="block rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              <p className="text-sm text-muted">
                {getLocalizedText(
                  course.title,
                  locale,
                )}
              </p>

              <h2 className="mt-1 text-lg font-semibold">
                {getLocalizedText(
                  moduleItem.title,
                  locale,
                )}
              </h2>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-strong">
                {getLocalizedText(
                  moduleItem.description,
                  locale,
                )}
              </p>
            </Link>
          ),
        )}
      </div>
    </div>
  );
}