import {
  getLocale,
  getTranslations,
} from "next-intl/server";

import {
  getLocalizedText,
  getMvpCatalogItems,
} from "@/content/registry";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Surface } from "@/components/ui/surface";
import type { SupportedLocale } from "@/domain/shared/types";
import { Link } from "@/i18n/navigation";

export default async function DashboardPage() {
  const locale =
    (await getLocale()) as SupportedLocale;

  const dashboardT =
    await getTranslations(
      "Dashboard",
    );

  const commonT =
    await getTranslations(
      "Common",
    );

  const catalogItems =
    getMvpCatalogItems();

  return (
    <div>
      <Eyebrow>
        {dashboardT("eyebrow")}
      </Eyebrow>

      <h1 className="mt-3 text-4xl font-bold tracking-[-0.04em]">
        {dashboardT("heading")}
      </h1>

      <p className="mt-3 max-w-2xl leading-7 text-muted-strong">
        {dashboardT(
          "description",
        )}
      </p>

      <section className="mt-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">
              {dashboardT(
                "sectionTitle",
              )}
            </h2>

            <p className="mt-1 text-sm text-muted">
              {dashboardT(
                "sectionDescription",
              )}
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-3">
          {catalogItems.map(
            (
              {
                course,
                module: moduleItem,
              },
              index,
            ) => (
              <Link
                key={moduleItem.id}
                href={`/app/learn/${course.slug}/${moduleItem.slug}`}
                className="group"
              >
                <Surface className="h-full p-6 transition-transform group-hover:-translate-y-0.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
                      {dashboardT(
                        "moduleNumber",
                        {
                          number:
                            String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            ),
                        },
                      )}
                    </span>

                    <span className="text-xs text-muted">
                      {commonT(
                        "notStarted",
                      )}
                    </span>
                  </div>

                  <p className="mt-7 text-sm font-medium text-muted">
                    {getLocalizedText(
                      course.title,
                      locale,
                    )}
                  </p>

                  <h3 className="mt-1 text-xl font-semibold tracking-[-0.02em]">
                    {getLocalizedText(
                      moduleItem.title,
                      locale,
                    )}
                  </h3>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-strong">
                    {getLocalizedText(
                      moduleItem.description,
                      locale,
                    )}
                  </p>

                  <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-surface-strong">
                    <div className="h-full w-0 bg-brand" />
                  </div>

                  <p className="mt-3 text-sm font-medium text-brand">
                    {commonT(
                      "openModuleArrow",
                    )}
                  </p>
                </Surface>
              </Link>
            ),
          )}
        </div>
      </section>
    </div>
  );
}