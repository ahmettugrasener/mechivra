import {
  getTranslations,
} from "next-intl/server";

import {
  notFound,
} from "next/navigation";

import { LearningWorkspaceShell } from "@/components/shells/learning-workspace-shell";

import {
  getActivitiesForModule,
  getCourseBySlug,
  getLocalizedText,
  getModuleBySlugs,
} from "@/content/registry";

import {
  getLearningActivityNavigation,
} from "@/content/learning-navigation";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import { LearningActivityRenderer } from "@/features/learning/learning-activity-renderer";

import {
  Link,
} from "@/i18n/navigation";

interface LearningActivityViewProps {
  readonly locale:
    SupportedLocale;

  readonly courseSlug:
    string;

  readonly moduleSlug:
    string;

  readonly activityId?:
    string;
}

export async function LearningActivityView({
  locale,
  courseSlug,
  moduleSlug,
  activityId,
}: LearningActivityViewProps) {
  const course =
    getCourseBySlug(
      courseSlug,
    );

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

  const selectedActivityId =
    activityId ??
    activities[0]?.id;

  if (!selectedActivityId) {
    notFound();
  }

  const navigation =
    getLearningActivityNavigation(
      learningModule.id,
      selectedActivityId,
    );

  if (!navigation) {
    notFound();
  }

  const learningT =
    await getTranslations(
      "LearningPage",
    );

  const localizedActivities =
    activities.map(
      (activity) => ({
        id: activity.id,

        title:
          getLocalizedText(
            activity.title,
            locale,
          ),
      }),
    );

  const previousTitle =
    navigation.previous
      ? getLocalizedText(
          navigation.previous
            .title,
          locale,
        )
      : null;

  const nextTitle =
    navigation.next
      ? getLocalizedText(
          navigation.next.title,
          locale,
        )
      : null;

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
      courseSlug={
        course.slug
      }
      moduleSlug={
        learningModule.slug
      }
      currentActivityId={
        navigation.current.id
      }
      activities={
        localizedActivities
      }
    >
      <article className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
            {learningT(
              "eyebrow",
            )}
          </p>

          <p className="text-xs font-medium text-muted">
            {navigation.position}
            {" / "}
            {navigation.total}
          </p>
        </div>

        <h2 className="mt-3 text-2xl font-bold tracking-[-0.03em]">
          {getLocalizedText(
            navigation.current
              .title,
            locale,
          )}
        </h2>

        <div className="mt-8">
          <LearningActivityRenderer
            activity={
              navigation.current
            }
            locale={
              locale
            }
          />
        </div>

        <nav className="mt-10 grid gap-3 border-t border-border pt-6 sm:grid-cols-2">
          <div>
            {navigation.previous &&
            previousTitle ? (
              <Link
                href={`/app/learn/${course.slug}/${learningModule.slug}/${navigation.previous.id}`}
                className="inline-flex min-h-11 w-full items-center justify-start rounded-lg border border-border-strong bg-surface px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface-subtle sm:w-auto"
              >
                ← {previousTitle}
              </Link>
            ) : null}
          </div>

          <div className="flex justify-end">
            {navigation.next &&
            nextTitle ? (
              <Link
                href={`/app/learn/${course.slug}/${learningModule.slug}/${navigation.next.id}`}
                className="inline-flex min-h-11 w-full items-center justify-end rounded-lg border border-brand bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover sm:w-auto"
              >
                {nextTitle} →
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center rounded-lg bg-success-soft px-4 py-2.5 text-sm font-semibold text-success">
                {learningT(
                  "continue",
                )}
              </span>
            )}
          </div>
        </nav>
      </article>
    </LearningWorkspaceShell>
  );
}