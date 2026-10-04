"use client";

import Link from "next/link";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getActivitiesForModule,
  getMvpCatalogItems,
} from "@/content/registry";

import type {
  ModuleProgressSummary,
  ProgressRepository,
} from "@/domain/progress";

import type {
  SupportedLocale,
} from "@/domain/shared/types";

import {
  getMvpModuleProgress,
} from "@/features/learning/progress/mvp-module-progress";

import {
  createDexieProgressRepository,
} from "@/infrastructure/persistence";

interface ProgressOverviewProps {
  readonly locale:
    SupportedLocale;

  readonly repository?:
    ProgressRepository;
}

interface ModuleProgressViewModel {
  readonly moduleId:
    string;

  readonly courseSlug:
    string;

  readonly moduleSlug:
    string;

  readonly courseTitle:
    string;

  readonly moduleTitle:
    string;

  readonly moduleDescription:
    string;

  readonly firstActivityId:
    string | null;

  readonly summary:
    ModuleProgressSummary;
}

function errorMessage(
  error:
    unknown,
): string {
  if (
    error instanceof
    Error
  ) {
    return error.message;
  }

  return String(
    error,
  );
}

function percentage(
  ratio:
    number,
): number {
  return Math.round(
    ratio *
      100,
  );
}

function statusLabel(
  status:
    ModuleProgressSummary["status"],

  locale:
    SupportedLocale,
): string {
  switch (
    status
  ) {
    case "not_started":
      return locale ===
        "tr"
        ? "Başlanmadı"
        : "Not started";

    case "in_progress":
      return locale ===
        "tr"
        ? "Devam ediyor"
        : "In progress";

    case "completed":
      return locale ===
        "tr"
        ? "Tamamlandı"
        : "Completed";
  }
}

function actionLabel(
  summary:
    ModuleProgressSummary,

  locale:
    SupportedLocale,
): string {
  if (
    summary.status ===
    "completed"
  ) {
    return locale ===
      "tr"
      ? "Modülü tekrar aç"
      : "Review module";
  }

  if (
    summary.status ===
    "in_progress"
  ) {
    return locale ===
      "tr"
      ? "Devam et"
      : "Continue";
  }

  return locale ===
    "tr"
    ? "Modüle başla"
    : "Start module";
}

export function ProgressOverview({
  locale,
  repository,
}: ProgressOverviewProps) {
  const catalog =
    useMemo(
      () =>
        getMvpCatalogItems(),
      [],
    );

  const [
    modules,
    setModules,
  ] =
    useState<
      readonly ModuleProgressViewModel[]
    >(
      [],
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true,
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null,
    );

  useEffect(
    () => {
      let cancelled =
        false;

      setLoading(
        true,
      );

      setError(
        null,
      );

      let activeRepository:
        ProgressRepository;

      try {
        if (
          repository
        ) {
          activeRepository =
            repository;
        } else {
          activeRepository =
            createDexieProgressRepository();
        }
      } catch (
        caughtError
      ) {
        setLoading(
          false,
        );

        setError(
          errorMessage(
            caughtError,
          ),
        );

        return () => {
          cancelled =
            true;
        };
      }

      void Promise.all(
        catalog.map(
          async (
            item,
          ): Promise<ModuleProgressViewModel> => {
            const aggregation =
              await getMvpModuleProgress(
                activeRepository,
                item.module.id,
              );

            const activities =
              getActivitiesForModule(
                item.module.id,
              );

            return {
              moduleId:
                item.module.id,

              courseSlug:
                item.course.slug,

              moduleSlug:
                item.module.slug,

              courseTitle:
                item.course.title[
                  locale
                ],

              moduleTitle:
                item.module.title[
                  locale
                ],

              moduleDescription:
                item.module
                  .description[
                  locale
                ],

              firstActivityId:
                activities[0]
                  ?.id ??
                null,

              summary:
                aggregation.summary,
            };
          },
        ),
      )
        .then(
          (
            result,
          ) => {
            if (
              cancelled
            ) {
              return;
            }

            setModules(
              result,
            );

            setLoading(
              false,
            );
          },
        )
        .catch(
          (
            caughtError,
          ) => {
            if (
              cancelled
            ) {
              return;
            }

            setError(
              errorMessage(
                caughtError,
              ),
            );

            setLoading(
              false,
            );
          },
        );

      return () => {
        cancelled =
          true;
      };
    },
    [
      catalog,
      locale,
      repository,
    ],
  );

  if (
    loading
  ) {
    return (
      <section
        data-testid="progress-overview"
        data-progress-loading="true"
        className="mt-8"
      >
        <div className="rounded-2xl border border-border bg-surface-subtle p-6">
          <p className="text-sm text-muted-strong">
            {locale ===
            "tr"
              ? "İlerleme verileri yükleniyor…"
              : "Loading progress…"}
          </p>
        </div>
      </section>
    );
  }

  if (
    error
  ) {
    return (
      <section
        data-testid="progress-overview"
        data-progress-loading="false"
        data-progress-error="true"
        className="mt-8"
      >
        <div className="rounded-2xl border border-warning/30 bg-warning/5 p-6">
          <h2 className="font-semibold text-foreground">
            {locale ===
            "tr"
              ? "İlerleme yüklenemedi"
              : "Progress could not be loaded"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-strong">
            {locale ===
            "tr"
              ? "Bu cihazdaki yerel ilerleme verilerine şu anda erişilemiyor."
              : "Local progress data on this device is currently unavailable."}
          </p>

          <p className="mt-2 text-xs text-muted">
            {
              error
            }
          </p>
        </div>
      </section>
    );
  }

  const totalActivities =
    modules.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.summary
          .totalActivityCount,
      0,
    );

  const completedActivities =
    modules.reduce(
      (
        total,
        item,
      ) =>
        total +
        item.summary
          .completedActivityCount,
      0,
    );

  const overallRatio =
    totalActivities ===
    0
      ? 0
      : completedActivities /
        totalActivities;

  return (
    <section
      data-testid="progress-overview"
      data-progress-loading="false"
      data-progress-error="false"
      data-total-activities={
        totalActivities
      }
      data-completed-activities={
        completedActivities
      }
      className="mt-8 space-y-6"
    >
      <div className="rounded-2xl border border-border bg-surface-subtle p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand">
              {locale ===
              "tr"
                ? "MVP ilerlemesi"
                : "MVP progress"}
            </p>

            <p
              data-testid="overall-progress-count"
              className="mt-2 text-3xl font-semibold tracking-tight text-foreground"
            >
              {
                completedActivities
              }
              /
              {
                totalActivities
              }
            </p>

            <p className="mt-1 text-sm text-muted-strong">
              {locale ===
              "tr"
                ? "aktivite tamamlandı"
                : "activities completed"}
            </p>
          </div>

          <p
            data-testid="overall-progress-percent"
            className="text-2xl font-semibold text-brand"
          >
            {percentage(
              overallRatio,
            )}
            %
          </p>
        </div>

        <div
          className="mt-5 h-2 overflow-hidden rounded-full bg-border"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-brand transition-[width]"
            style={{
              width:
                `${percentage(
                  overallRatio,
                )}%`,
            }}
          />
        </div>

        <p className="mt-4 text-xs leading-5 text-muted">
          {locale ===
          "tr"
            ? "Tamamlanma, aktivitenin öğrenme kuralına göre hesaplanır. Bir değerlendirmeyi tamamlamak, cevabın doğru olduğu veya konunun ustalaşıldığı anlamına gelmez."
            : "Completion is based on each activity's learning rule. Completing an assessment does not imply that the answer was correct or that the concept was mastered."}
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-3">
        {modules.map(
          (
            item,
          ) => {
            const percent =
              percentage(
                item.summary
                  .completionRatio,
              );

            const href =
              item.firstActivityId
                ? `/${locale}/app/learn/${item.courseSlug}/${item.moduleSlug}/${item.firstActivityId}`
                : `/${locale}/app/courses`;

            return (
              <article
                key={
                  item.moduleId
                }
                data-testid={`module-progress-${item.moduleId}`}
                data-module-progress-status={
                  item.summary
                    .status
                }
                data-module-progress-completed={
                  item.summary
                    .completedActivityCount
                }
                data-module-progress-total={
                  item.summary
                    .totalActivityCount
                }
                className="flex flex-col rounded-2xl border border-border bg-background p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.1em] text-brand">
                      {
                        item.courseTitle
                      }
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                      {
                        item.moduleTitle
                      }
                    </h2>
                  </div>

                  <span className="shrink-0 rounded-full border border-border bg-surface-subtle px-3 py-1 text-xs font-semibold text-muted-strong">
                    {statusLabel(
                      item.summary
                        .status,
                      locale,
                    )}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-muted-strong">
                  {
                    item.moduleDescription
                  }
                </p>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-4 text-sm">
                    <span className="text-muted">
                      {locale ===
                      "tr"
                        ? "Tamamlanan"
                        : "Completed"}
                    </span>

                    <strong className="font-semibold text-foreground">
                      {
                        item.summary
                          .completedActivityCount
                      }
                      /
                      {
                        item.summary
                          .totalActivityCount
                      }
                    </strong>
                  </div>

                  <div
                    className="mt-2 h-2 overflow-hidden rounded-full bg-border"
                    aria-hidden="true"
                  >
                    <div
                      className="h-full rounded-full bg-brand transition-[width]"
                      style={{
                        width:
                          `${percent}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-4 text-xs text-muted">
                    <span>
                      {item.summary
                        .startedActivityCount}{" "}
                      {locale ===
                      "tr"
                        ? "aktiviteye başlandı"
                        : "activities started"}
                    </span>

                    <span>
                      {
                        percent
                      }
                      %
                    </span>
                  </div>
                </div>

                <div className="mt-auto pt-6">
                  <Link
                    href={
                      href
                    }
                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-brand bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-hover"
                  >
                    {actionLabel(
                      item.summary,
                      locale,
                    )}
                  </Link>
                </div>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}