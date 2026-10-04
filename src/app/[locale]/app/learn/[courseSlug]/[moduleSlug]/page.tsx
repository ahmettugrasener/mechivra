import {
  getMvpCatalogItems,
} from "@/content/registry";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { LearningActivityView } from "@/features/learning/learning-activity-view";

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
      courseSlug:
        course.slug,

      moduleSlug:
        moduleItem.slug,
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
    />
  );
}