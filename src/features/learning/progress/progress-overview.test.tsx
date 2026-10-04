import {
  cleanup,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import {
  afterEach,
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
  getMvpCatalogItems,
} from "@/content/registry";

import type {
  AssessmentAttemptHistory,
} from "@/domain/assessment";

import {
  createActivityProgress,
  recordActivityProgressEvent,
} from "@/domain/progress";

import type {
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  ProgressOverview,
} from "@/features/learning/progress/progress-overview";

afterEach(
  () => {
    cleanup();
  },
);

class MemoryProgressRepository
  implements ProgressRepository {
  readonly activities:
    ActivityProgress[] =
    [];

  async getActivityProgress(
    identity:
      ActivityProgressIdentity,
  ): Promise<
    ActivityProgress | null
  > {
    return (
      this.activities.find(
        (
          item,
        ) =>
          item.moduleId ===
            identity.moduleId &&
          item.moduleVersion ===
            identity.moduleVersion &&
          item.activityId ===
            identity.activityId &&
          item.activityVersion ===
            identity.activityVersion,
      ) ??
      null
    );
  }

  async listActivityProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<
    readonly ActivityProgress[]
  > {
    return this.activities.filter(
      (
        item,
      ) =>
        item.moduleId ===
          identity.moduleId &&
        item.moduleVersion ===
          identity.moduleVersion,
    );
  }

  async saveActivityProgress(
    progress:
      ActivityProgress,
  ): Promise<void> {
    this.activities.push(
      progress,
    );
  }

  async deleteActivityProgress(
    _identity:
      ActivityProgressIdentity,
  ): Promise<void> {}

  async getModuleProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<
    ModuleProgress | null
  > {
    return null;
  }

  async deleteModuleActivityProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<void> {}

  async getAssessmentAttemptHistory<
    TResponse,
  >(
    _identity:
      AssessmentHistoryIdentity,
  ): Promise<
    AssessmentAttemptHistory<TResponse> | null
  > {
    return null;
  }

  async saveAssessmentAttemptHistory<
    TResponse,
  >(
    _history:
      AssessmentAttemptHistory<TResponse>,
  ): Promise<void> {}

  async deleteAssessmentAttemptHistory(
    _identity:
      AssessmentHistoryIdentity,
  ): Promise<void> {}

  async clearAllProgress():
    Promise<void> {
    this.activities.splice(
      0,
      this.activities.length,
    );
  }
}

function completedProgress(
  moduleId:
    string,

  moduleVersion:
    string,

  activityId:
    string,

  activityVersion:
    string,

  completionRule:
    Parameters<
      typeof recordActivityProgressEvent
    >[1],

  event:
    Parameters<
      typeof recordActivityProgressEvent
    >[2],
): ActivityProgress {
  const initial =
    createActivityProgress({
      moduleId,
      moduleVersion,
      activityId,
      activityVersion,
    });

  return recordActivityProgressEvent(
    initial,
    completionRule,
    event,
    "2026-10-04T12:00:00.000Z",
  );
}

describe(
  "ProgressOverview",
  () => {
    it(
      "renders all three MVP modules with zero progress when no records exist",
      async () => {
        const repository =
          new MemoryProgressRepository();

        render(
          <ProgressOverview
            locale="en"
            repository={
              repository
            }
          />,
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "progress-overview",
              ),
            ).toHaveAttribute(
              "data-progress-loading",
              "false",
            );
          },
        );

        expect(
          screen.getByTestId(
            "overall-progress-count",
          ),
        ).toHaveTextContent(
          "0/18",
        );

        expect(
          screen.getByTestId(
            "overall-progress-percent",
          ),
        ).toHaveTextContent(
          "0%",
        );

        for (
          const item
          of getMvpCatalogItems()
        ) {
          expect(
            screen.getByTestId(
              `module-progress-${item.module.id}`,
            ),
          ).toHaveAttribute(
            "data-module-progress-status",
            "not_started",
          );
        }
      },
    );

    it(
      "renders persisted Statics completion without using assessment correctness",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const statics =
          getMvpCatalogItems().find(
            (
              item,
            ) =>
              item.module.id ===
              "module-simply-supported-beam",
          );

        if (
          !statics
        ) {
          throw new Error(
            "Expected Statics MVP module.",
          );
        }

        const activities =
          getActivitiesForModule(
            statics.module.id,
          );

        const first =
          activities[0];

        const prediction =
          activities[2];

        if (
          !first ||
          !prediction
        ) {
          throw new Error(
            "Expected Statics activities.",
          );
        }

        repository.activities.push(
          completedProgress(
            statics.module.id,
            statics.module.version,
            first.id,
            first.version,
            first.completionRule,
            "reached_end",
          ),

          completedProgress(
            statics.module.id,
            statics.module.version,
            prediction.id,
            prediction.version,
            prediction.completionRule,
            "prediction_submitted",
          ),
        );

        render(
          <ProgressOverview
            locale="tr"
            repository={
              repository
            }
          />,
        );

        const card =
          await screen.findByTestId(
            "module-progress-module-simply-supported-beam",
          );

        expect(
          card,
        ).toHaveAttribute(
          "data-module-progress-status",
          "in_progress",
        );

        expect(
          card,
        ).toHaveAttribute(
          "data-module-progress-completed",
          "2",
        );

        expect(
          card,
        ).toHaveAttribute(
          "data-module-progress-total",
          "6",
        );

        expect(
          screen.getByTestId(
            "overall-progress-count",
          ),
        ).toHaveTextContent(
          "2/18",
        );

        expect(
          card,
        ).toHaveTextContent(
          "Devam ediyor",
        );
      },
    );

    it(
      "uses localized course and module titles and links to the first activity",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const firstItem =
          getMvpCatalogItems()[0];

        if (
          !firstItem
        ) {
          throw new Error(
            "Expected an MVP catalog item.",
          );
        }

        const firstActivity =
          getActivitiesForModule(
            firstItem.module.id,
          )[0];

        if (
          !firstActivity
        ) {
          throw new Error(
            "Expected a first module activity.",
          );
        }

        render(
          <ProgressOverview
            locale="en"
            repository={
              repository
            }
          />,
        );

        await waitFor(
          () => {
            expect(
              screen.getByTestId(
                "progress-overview",
              ),
            ).toHaveAttribute(
              "data-progress-loading",
              "false",
            );
          },
        );

        expect(
          screen.getByText(
            firstItem.course
              .title.en,
          ),
        ).toBeInTheDocument();

        expect(
          screen.getByText(
            firstItem.module
              .title.en,
          ),
        ).toBeInTheDocument();

        const startLinks =
          screen.getAllByRole(
            "link",
            {
              name:
                "Start module",
            },
          );

        expect(
          startLinks.some(
            (
              link,
            ) =>
              link.getAttribute(
                "href",
              ) ===
              `/en/app/learn/${firstItem.course.slug}/${firstItem.module.slug}/${firstActivity.id}`,
          ),
        ).toBe(
          true,
        );
      },
    );
  },
);