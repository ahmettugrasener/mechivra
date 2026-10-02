import { notFound } from "next/navigation";

import {
  courses,
  getCourseBySlug,
  getLocalizedText,
  getModulesForCourse,
} from "@/content/registry";
import type { SupportedLocale } from "@/domain/shared/types";
import { Link } from "@/i18n/navigation";

interface CoursePageProps {
  readonly params: Promise<{
    locale: string;
    courseSlug: string;
  }>;
}

export function generateStaticParams() {
  return courses.map((course) => ({
    courseSlug: course.slug,
  }));
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const {
    locale: localeParameter,
    courseSlug,
  } = await params;

  const locale =
    localeParameter as SupportedLocale;

  const course =
    getCourseBySlug(courseSlug);

  if (!course) {
    notFound();
  }

  const courseModules =
    getModulesForCourse(course.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm text-muted">
        {locale === "tr"
          ? "Ders"
          : "Course"}
      </p>

      <h1 className="mt-2 text-4xl font-bold tracking-[-0.04em]">
        {getLocalizedText(
          course.title,
          locale,
        )}
      </h1>

      <p className="mt-5 max-w-3xl leading-7 text-muted-strong">
        {getLocalizedText(
          course.description,
          locale,
        )}
      </p>

      <div className="mt-12">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
          {locale === "tr"
            ? "Kullanılabilir öğrenme modülleri"
            : "Available learning modules"}
        </p>

        <div className="mt-4 space-y-4">
          {courseModules.map(
            (moduleItem) => (
              <section
                key={moduleItem.id}
                className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
              >
                <h2 className="text-2xl font-semibold">
                  {getLocalizedText(
                    moduleItem.title,
                    locale,
                  )}
                </h2>

                <p className="mt-3 leading-7 text-muted-strong">
                  {getLocalizedText(
                    moduleItem.description,
                    locale,
                  )}
                </p>

                <Link
                  href={`/app/learn/${course.slug}/${moduleItem.slug}`}
                  className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                >
                  {locale === "tr"
                    ? "Modülü Aç"
                    : "Open Module"}
                </Link>
              </section>
            ),
          )}
        </div>
      </div>
    </div>
  );
}