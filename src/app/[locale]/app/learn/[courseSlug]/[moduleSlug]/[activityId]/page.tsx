import {
  getActivitiesForModule,
  getMvpCatalogItems,
} from "@/content/registry";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { LearningActivityView } from "@/features/learning/learning-activity-view";

interface LearningActivityPageProps {
  readonly params: Promise<{
    locale: string;
    courseSlug: string;
    moduleSlug: string;
    activityId: string;
  }>;
}

export function generateStaticParams() {
  return getMvpCatalogItems().flatMap(
    ({
      course,
      module: moduleItem,
    }) =>
      getActivitiesForModule(
        moduleItem.id,
      ).map(
        (activity) => ({
          courseSlug:
            course.slug,

          moduleSlug:
            moduleItem.slug,

          activityId:
            activity.id,
        }),
      ),
  );
}

export default async function LearningActivityPage({
  params,
}: LearningActivityPageProps) {
  const {
    locale: localeParameter,
    courseSlug,
    moduleSlug,
    activityId,
  } = await params;

  return (
    <LearningActivityView
      locale={
        localeParameter as SupportedLocale
      }
      courseSlug={
        courseSlug
      }
      moduleSlug={
        moduleSlug
      }
      activityId={
        activityId
      }
    />
  );
}