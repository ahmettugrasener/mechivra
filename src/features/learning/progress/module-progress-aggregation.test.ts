import {
  describe,
  expect,
  it,
} from "vitest";

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
  ModuleProgressAggregationError,
  aggregateModuleProgress,
} from "@/features/learning/progress/module-progress-aggregation";

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
          activity,
        ) =>
          activity.moduleId ===
            identity.moduleId &&
          activity.moduleVersion ===
            identity.moduleVersion &&
          activity.activityId ===
            identity.activityId &&
          activity.activityVersion ===
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
        activity,
      ) =>
        activity.moduleId ===
          identity.moduleId &&
        activity.moduleVersion ===
          identity.moduleVersion,
    );
  }

  async saveActivityProgress(
    progress:
      ActivityProgress,
  ): Promise<void> {
    const index =
      this.activities.findIndex(
        (
          activity,
        ) =>
          activity.moduleId ===
            progress.moduleId &&
          activity.moduleVersion ===
            progress.moduleVersion &&
          activity.activityId ===
            progress.activityId,
      );

    if (
      index ===
      -1
    ) {
      this.activities.push(
        progress,
      );

      return;
    }

    this.activities[
      index
    ] =
      progress;
  }

  async deleteActivityProgress(
    identity:
      ActivityProgressIdentity,
  ): Promise<void> {
    const index =
      this.activities.findIndex(
        (
          activity,
        ) =>
          activity.moduleId ===
            identity.moduleId &&
          activity.moduleVersion ===
            identity.moduleVersion &&
          activity.activityId ===
            identity.activityId &&
          activity.activityVersion ===
            identity.activityVersion,
      );

    if (
      index >=
      0
    ) {
      this.activities.splice(
        index,
        1,
      );
    }
  }

  async getModuleProgress(
    _identity:
      ModuleProgressIdentity,
  ): Promise<
    ModuleProgress | null
  > {
    return null;
  }

  async deleteModuleActivityProgress(
    identity:
      ModuleProgressIdentity,
  ): Promise<void> {
    for (
      let index =
        this.activities.length -
        1;
      index >=
      0;
      index -=
        1
    ) {
      const activity =
        this.activities[
          index
        ];

      if (
        activity?.moduleId ===
          identity.moduleId &&
        activity.moduleVersion ===
          identity.moduleVersion
      ) {
        this.activities.splice(
          index,
          1,
        );
      }
    }
  }

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

const expectedActivities =
  [
    {
      id:
        "activity-01",

      version:
        "1.0.0",
    },

    {
      id:
        "activity-02",

      version:
        "1.0.0",
    },

    {
      id:
        "activity-03",

      version:
        "1.0.0",
    },

    {
      id:
        "activity-04",

      version:
        "1.0.0",
    },

    {
      id:
        "activity-05",

      version:
        "1.0.0",
    },

    {
      id:
        "activity-06",

      version:
        "1.0.0",
    },
  ] as const;

function makeProgress(
  activityId:
    string,

  status:
    | "in_progress"
    | "completed",

  occurredAt:
    string,
): ActivityProgress {
  const initial =
    createActivityProgress({
      moduleId:
        "module-test",

      moduleVersion:
        "1.0.0",

      activityId,

      activityVersion:
        "1.0.0",
    });

  if (
    status ===
    "in_progress"
  ) {
    return recordActivityProgressEvent(
      initial,

      {
        type:
          "reached_end",
      },

      "opened",

      occurredAt,
    );
  }

  return recordActivityProgressEvent(
    initial,

    {
      type:
        "reached_end",
    },

    "reached_end",

    occurredAt,
  );
}

describe(
  "module progress aggregation",
  () => {
    it(
      "returns a not-started six-activity summary when nothing is persisted",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const aggregation =
          await aggregateModuleProgress(
            repository,
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activities:
                expectedActivities,
            },
          );

        expect(
          aggregation
            .progress
            .activityProgress,
        ).toEqual(
          [],
        );

        expect(
          aggregation.summary,
        ).toEqual({
          status:
            "not_started",

          totalActivityCount:
            6,

          startedActivityCount:
            0,

          completedActivityCount:
            0,

          completionRatio:
            0,
        });
      },
    );

    it(
      "derives partial module progress from persisted activity states",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.activities.push(
          makeProgress(
            "activity-01",
            "completed",
            "2026-10-04T10:00:00.000Z",
          ),

          makeProgress(
            "activity-02",
            "completed",
            "2026-10-04T10:05:00.000Z",
          ),

          makeProgress(
            "activity-03",
            "in_progress",
            "2026-10-04T10:10:00.000Z",
          ),
        );

        const aggregation =
          await aggregateModuleProgress(
            repository,
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activities:
                expectedActivities,
            },
          );

        expect(
          aggregation
            .summary
            .status,
        ).toBe(
          "in_progress",
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
          3,
        );

        expect(
          aggregation
            .summary
            .completedActivityCount,
        ).toBe(
          2,
        );

        expect(
          aggregation
            .summary
            .completionRatio,
        ).toBeCloseTo(
          2 /
            6,
          12,
        );

        expect(
          aggregation
            .progress
            .updatedAt,
        ).toBe(
          "2026-10-04T10:10:00.000Z",
        );
      },
    );

    it(
      "derives completed only when all six expected activities are complete",
      async () => {
        const repository =
          new MemoryProgressRepository();

        expectedActivities.forEach(
          (
            activity,
            index,
          ) => {
            repository.activities.push(
              makeProgress(
                activity.id,
                "completed",
                `2026-10-04T10:${String(
                  index,
                ).padStart(
                  2,
                  "0",
                )}:00.000Z`,
              ),
            );
          },
        );

        const aggregation =
          await aggregateModuleProgress(
            repository,
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activities:
                expectedActivities,
            },
          );

        expect(
          aggregation.summary,
        ).toEqual({
          status:
            "completed",

          totalActivityCount:
            6,

          startedActivityCount:
            6,

          completedActivityCount:
            6,

          completionRatio:
            1,
        });
      },
    );

    it(
      "returns persisted activities in current curriculum order",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.activities.push(
          makeProgress(
            "activity-05",
            "completed",
            "2026-10-04T10:05:00.000Z",
          ),

          makeProgress(
            "activity-01",
            "completed",
            "2026-10-04T10:01:00.000Z",
          ),

          makeProgress(
            "activity-03",
            "completed",
            "2026-10-04T10:03:00.000Z",
          ),
        );

        const aggregation =
          await aggregateModuleProgress(
            repository,
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activities:
                expectedActivities,
            },
          );

        expect(
          aggregation
            .progress
            .activityProgress
            .map(
              (
                progress: { activityId: any; },
              ) =>
                progress.activityId,
            ),
        ).toEqual([
          "activity-01",
          "activity-03",
          "activity-05",
        ]);
      },
    );

    it(
      "rejects persisted progress for an activity outside the current module definition",
      async () => {
        const repository =
          new MemoryProgressRepository();

        repository.activities.push(
          makeProgress(
            "activity-retired",
            "completed",
            "2026-10-04T10:00:00.000Z",
          ),
        );

        await expect(
          aggregateModuleProgress(
            repository,
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activities:
                expectedActivities,
            },
          ),
        ).rejects.toBeInstanceOf(
          ModuleProgressAggregationError,
        );
      },
    );

    it(
      "requires explicit migration when a persisted activity version differs from the curriculum",
      async () => {
        const repository =
          new MemoryProgressRepository();

        const stale =
          createActivityProgress({
            moduleId:
              "module-test",

            moduleVersion:
              "1.0.0",

            activityId:
              "activity-01",

            activityVersion:
              "0.9.0",
          });

        repository.activities.push(
          stale,
        );

        await expect(
          aggregateModuleProgress(
            repository,
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activities:
                expectedActivities,
            },
          ),
        ).rejects.toThrow(
          /explicit progress migration/i,
        );
      },
    );

    it(
      "rejects duplicate expected activity identities",
      async () => {
        const repository =
          new MemoryProgressRepository();

        await expect(
          aggregateModuleProgress(
            repository,
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activities: [
                {
                  id:
                    "activity-01",

                  version:
                    "1.0.0",
                },

                {
                  id:
                    "activity-01",

                  version:
                    "1.0.0",
                },
              ],
            },
          ),
        ).rejects.toThrow(
          /must be unique/i,
        );
      },
    );
  },
);