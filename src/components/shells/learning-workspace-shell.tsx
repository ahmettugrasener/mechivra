import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";

export interface LearningWorkspaceActivity {
  readonly id: string;
  readonly title: string;
}

interface LearningWorkspaceShellProps {
  readonly courseTitle: string;
  readonly moduleTitle: string;

  readonly courseSlug: string;
  readonly moduleSlug: string;

  readonly currentActivityId: string;

  readonly activities:
    readonly LearningWorkspaceActivity[];

  readonly children:
    React.ReactNode;
}

export function LearningWorkspaceShell({
  courseTitle,
  moduleTitle,
  courseSlug,
  moduleSlug,
  currentActivityId,
  activities,
  children,
}: LearningWorkspaceShellProps) {
  const commonT =
    useTranslations("Common");

  const workspaceT =
    useTranslations(
      "LearningWorkspace",
    );

  const currentIndex =
    activities.findIndex(
      (activity) =>
        activity.id ===
        currentActivityId,
    );

  const currentPosition =
    currentIndex >= 0
      ? currentIndex + 1
      : 0;

  const progressPercent =
    activities.length > 0
      ? (
          currentPosition /
          activities.length
        ) *
        100
      : 0;

  return (
    <div>
      <header className="border-b border-border pb-6">
        <Link
          href="/app/courses"
          className="text-sm font-medium text-brand hover:underline"
        >
          {commonT(
            "backToCourses",
          )}
        </Link>

        <div className="mt-5">
          <p className="text-sm font-medium text-muted">
            {courseTitle}
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-[-0.03em] text-foreground">
            {moduleTitle}
          </h1>
        </div>
      </header>

      <div className="grid gap-8 py-8 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside>
          <div className="rounded-2xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold">
                {workspaceT(
                  "title",
                )}
              </p>

              <span className="text-xs text-muted">
                {currentPosition} /{" "}
                {activities.length}
              </span>
            </div>

            <div
              aria-hidden="true"
              className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-strong"
            >
              <div
                className="h-full bg-brand transition-[width] duration-200"
                style={{
                  width:
                    `${progressPercent}%`,
                }}
              />
            </div>

            <nav
              aria-label="Module navigation"
              className="mt-5 space-y-1"
            >
              {activities.map(
                (
                  activity,
                  index,
                ) => {
                  const isCurrent =
                    activity.id ===
                    currentActivityId;

                  return (
                    <Link
                      key={
                        activity.id
                      }
                      href={`/app/learn/${courseSlug}/${moduleSlug}/${activity.id}`}
                      aria-current={
                        isCurrent
                          ? "step"
                          : undefined
                      }
                      className={[
                        "flex min-h-11 items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                        isCurrent
                          ? "bg-brand-soft font-semibold text-brand"
                          : "text-muted-strong hover:bg-surface-subtle hover:text-foreground",
                      ].join(
                        " ",
                      )}
                    >
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-current text-xs">
                        {index + 1}
                      </span>

                      <span className="leading-5">
                        {
                          activity.title
                        }
                      </span>
                    </Link>
                  );
                },
              )}
            </nav>
          </div>
        </aside>

        <section className="min-w-0">
          {children}
        </section>
      </div>
    </div>
  );
}