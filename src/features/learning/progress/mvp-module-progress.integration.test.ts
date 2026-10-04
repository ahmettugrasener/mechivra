import {
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

import type {
  ActivityProgress,
  ActivityProgressIdentity,
  AssessmentHistoryIdentity,
  ModuleProgress,
  ModuleProgressIdentity,
  ProgressRepository,
} from "@/domain/progress";

import {
  getMvpModuleProgress,
} from "@/features/learning/progress/mvp-module-progress";

class EmptyProgressRepository
  implements ProgressRepository {
  async getActivityProgress(
    _identity:
      ActivityProgressIdentity,
  ): Promise<
    ActivityProgress | null
  > {
    return null;
  }

  async listActivityProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<
    readonly ActivityProgress[]
  > {
    return [];
  }

  async saveActivityProgress(
    _progress:
      ActivityProgress,
  ): Promise<void> {}

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
    Promise<void> {}
}

describe(
  "MVP module progress aggregation",
  () => {
    it(
      "derives a six-activity summary for every MVP module",
      async () => {
        const repository =
          new EmptyProgressRepository();

        const catalog =
          getMvpCatalogItems();

        expect(
          catalog,
        ).toHaveLength(
          3,
        );

        for (
          const item
          of catalog
        ) {
          const activities =
            getActivitiesForModule(
              item.module.id,
            );

          expect(
            activities,
          ).toHaveLength(
            6,
          );

          const aggregation =
            await getMvpModuleProgress(
              repository,
              item.module.id,
            );

          expect(
            aggregation
              .progress
              .moduleId,
          ).toBe(
            item.module.id,
          );

          expect(
            aggregation
              .progress
              .moduleVersion,
          ).toBe(
            item.module.version,
          );

          expect(
            aggregation
              .summary
              .totalActivityCount,
          ).toBe(
            6,
          );

          expect(
            aggregation
              .summary
              .startedActivityCount,
          ).toBe(
            0,
          );

          expect(
            aggregation
              .summary
              .completedActivityCount,
          ).toBe(
            0,
          );

          expect(
            aggregation
              .summary
              .completionRatio,
          ).toBe(
            0,
          );

          expect(
            aggregation
              .summary
              .status,
          ).toBe(
            "not_started",
          );
        }
      },
    );

    it(
      "does not add locale to module progress identity",
      async () => {
        const repository =
          new EmptyProgressRepository();

        const moduleItem =
          getMvpCatalogItems()[0];

        if (
          !moduleItem
        ) {
          throw new Error(
            "Expected at least one MVP module.",
          );
        }

        const aggregation =
          await getMvpModuleProgress(
            repository,
            moduleItem.module.id,
          );

        expect(
          "locale" in
            aggregation.progress,
        ).toBe(
          false,
        );
      },
    );
  },
);