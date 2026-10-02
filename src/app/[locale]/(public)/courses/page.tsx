import { getLocale } from "next-intl/server";

import {
  courses,
  getLocalizedText,
  getModulesForCourse,
} from "@/content/registry";
import type { SupportedLocale } from "@/domain/shared/types";
import { Link } from "@/i18n/navigation";

export default async function CoursesPage() {
  const locale =
    (await getLocale()) as SupportedLocale;

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <h1 className="text-3xl font-semibold">
        {locale === "tr"
          ? "Dersler"
          : "Courses"}
      </h1>

      <p className="mt-3 max-w-2xl text-muted-strong">
        {locale === "tr"
          ? "Mechivra MVP üç tamamlanmış öğrenme modülüyle başlayacaktır."
          : "The Mechivra MVP will begin with three complete learning modules."}
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {courses.map((course) => {
          const courseModules =
            getModulesForCourse(
              course.id,
            );

          return (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)] transition-transform hover:-translate-y-0.5"
            >
              <p className="text-sm text-muted">
                {locale === "tr"
                  ? "Ders"
                  : "Course"}
              </p>

              <h2 className="mt-2 text-xl font-semibold">
                {getLocalizedText(
                  course.title,
                  locale,
                )}
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted-strong">
                {getLocalizedText(
                  course.description,
                  locale,
                )}
              </p>

              <div className="mt-6 border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">
                  {locale === "tr"
                    ? "Kullanılabilir modül"
                    : "Available module"}
                </p>

                {courseModules.map(
                  (moduleItem) => (
                    <p
                      key={
                        moduleItem.id
                      }
                      className="mt-2 font-medium text-brand"
                    >
                      {getLocalizedText(
                        moduleItem.title,
                        locale,
                      )}
                    </p>
                  ),
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}