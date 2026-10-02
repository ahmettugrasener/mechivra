import { notFound } from "next/navigation";

import { LearningWorkspaceShell } from "@/components/shells/learning-workspace-shell";
import {
  getActivitiesForModule,
  getCourseBySlug,
  getLocalizedText,
  getModuleBySlugs,
  getMvpCatalogItems,
} from "@/content/registry";
import type { SupportedLocale } from "@/domain/shared/types";

interface LearningPageProps {
  readonly params: Promise<{
    locale: string;
    courseSlug: string;
    moduleSlug: string;
  }>;
}

export function generateStaticParams() {
  return getMvpCatalogItems().map(
    ({
      course,
      module: moduleItem,
    }) => ({
      courseSlug: course.slug,
      moduleSlug: moduleItem.slug,
    }),
  );
}

export default async function LearningPage({
  params,
}: LearningPageProps) {
  const {
    locale: localeParameter,
    courseSlug,
    moduleSlug,
  } = await params;

  const locale =
    localeParameter as SupportedLocale;

  const course =
    getCourseBySlug(courseSlug);

  const learningModule =
    getModuleBySlugs(
      courseSlug,
      moduleSlug,
    );

  if (
    !course ||
    !learningModule
  ) {
    notFound();
  }

  const activities =
    getActivitiesForModule(
      learningModule.id,
    );

  const localizedActivities =
    activities.map(
      (activity) => ({
        id: activity.id,
        title: getLocalizedText(
          activity.title,
          locale,
        ),
      }),
    );

  return (
    <LearningWorkspaceShell
      courseTitle={getLocalizedText(
        course.title,
        locale,
      )}
      moduleTitle={getLocalizedText(
        learningModule.title,
        locale,
      )}
      activities={
        localizedActivities
      }
    >
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
          {locale === "tr"
            ? "Öğrenme etkinliği"
            : "Learning activity"}
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">
          {activities.length >
          0
            ? getLocalizedText(
                activities[0].title,
                locale,
              )
            : locale === "tr"
              ? "Etkinlik bulunamadı"
              : "No activity found"}
        </h2>

        <p className="mt-4 max-w-2xl leading-7 text-muted-strong">
          {getLocalizedText(
            learningModule.description,
            locale,
          )}
        </p>

        <div className="mt-8 rounded-xl border border-dashed border-border-strong bg-background p-8 text-center">
          <p className="font-semibold">
            {locale === "tr"
              ? "Gerçek etkinlik içeriği sonraki modül geliştirme aşamasında buraya bağlanacak."
              : "The real activity content will be connected here during module development."}
          </p>

          <p className="mt-2 text-sm text-muted">
            {locale === "tr"
              ? `${activities.length} öğrenme etkinliği içerik registry'sinden başarıyla yüklendi.`
              : `${activities.length} learning activities were loaded successfully from the content registry.`}
          </p>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            disabled
            className="min-h-11 cursor-not-allowed rounded-lg bg-surface-strong px-4 py-2.5 text-sm font-semibold text-muted"
          >
            {locale === "tr"
              ? "Devam →"
              : "Continue →"}
          </button>
        </div>
      </div>
    </LearningWorkspaceShell>
  );
}