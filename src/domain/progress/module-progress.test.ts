import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createActivityProgress,
  recordActivityProgressEvent,
} from "@/domain/progress/activity-progress";

import {
  createModuleProgress,
  getActivityProgress,
  summarizeModuleProgress,
  upsertActivityProgress,
} from "@/domain/progress/module-progress";

describe(
  "Module progress",
  () => {
    it(
      "starts as an empty persistence-neutral aggregate",
      () => {
        const progress =
          createModuleProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",
            },
          );

        expect(
          progress.activityProgress,
        ).toEqual(
          [],
        );

        expect(
          progress.updatedAt,
        ).toBeNull();
      },
    );

    it(
      "adds and resolves activity progress",
      () => {
        const moduleProgress =
          createModuleProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",
            },
          );

        const activityProgress =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-1",

              activityVersion:
                "1.0.0",
            },
          );

        const updated =
          upsertActivityProgress(
            moduleProgress,
            activityProgress,
          );

        expect(
          updated.activityProgress,
        ).toHaveLength(
          1,
        );

        expect(
          getActivityProgress(
            updated,
            "activity-1",
          ),
        ).toEqual(
          activityProgress,
        );
      },
    );

    it(
      "replaces the same activity identity without creating duplicate progress",
      () => {
        const moduleProgress =
          createModuleProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",
            },
          );

        const initialActivity =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-1",

              activityVersion:
                "1.0.0",
            },
          );

        const startedActivity =
          recordActivityProgressEvent(
            initialActivity,

            {
              type:
                "reached_end",
            },

            "opened",

            "2026-10-04T10:00:00.000Z",
          );

        const first =
          upsertActivityProgress(
            moduleProgress,
            initialActivity,
          );

        const second =
          upsertActivityProgress(
            first,
            startedActivity,
          );

        expect(
          second.activityProgress,
        ).toHaveLength(
          1,
        );

        expect(
          second.activityProgress[
            0
          ]?.status,
        ).toBe(
          "in_progress",
        );
      },
    );

    it(
      "rejects activity progress from another module",
      () => {
        const moduleProgress =
          createModuleProgress(
            {
              moduleId:
                "module-a",

              moduleVersion:
                "1.0.0",
            },
          );

        const activityProgress =
          createActivityProgress(
            {
              moduleId:
                "module-b",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-1",

              activityVersion:
                "1.0.0",
            },
          );

        expect(
          () =>
            upsertActivityProgress(
              moduleProgress,
              activityProgress,
            ),
        ).toThrow(
          /same module identity/i,
        );
      },
    );

    it(
      "does not silently move progress between activity versions",
      () => {
        const moduleProgress =
          createModuleProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",
            },
          );

        const versionOne =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-1",

              activityVersion:
                "1.0.0",
            },
          );

        const versionTwo =
          createActivityProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",

              activityId:
                "activity-1",

              activityVersion:
                "2.0.0",
            },
          );

        const first =
          upsertActivityProgress(
            moduleProgress,
            versionOne,
          );

        expect(
          () =>
            upsertActivityProgress(
              first,
              versionTwo,
            ),
        ).toThrow(
          /explicit migration/i,
        );
      },
    );

    it(
      "summarizes untouched activities as not started",
      () => {
        const moduleProgress =
          createModuleProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",
            },
          );

        expect(
          summarizeModuleProgress(
            moduleProgress,
            [
              "activity-1",
              "activity-2",
              "activity-3",
            ],
          ),
        ).toEqual({
          status:
            "not_started",

          totalActivityCount:
            3,

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
      "derives module progress from activity states",
      () => {
        let moduleProgress =
          createModuleProgress(
            {
              moduleId:
                "module-test",

              moduleVersion:
                "1.0.0",
            },
          );

        const activityOne =
          recordActivityProgressEvent(
            createActivityProgress(
              {
                moduleId:
                  "module-test",

                moduleVersion:
                  "1.0.0",

                activityId:
                  "activity-1",

                activityVersion:
                  "1.0.0",
              },
            ),

            {
              type:
                "reached_end",
            },

            "reached_end",

            "2026-10-04T10:00:00.000Z",
          );

        const activityTwo =
          recordActivityProgressEvent(
            createActivityProgress(
              {
                moduleId:
                  "module-test",

                moduleVersion:
                  "1.0.0",

                activityId:
                  "activity-2",

                activityVersion:
                  "1.0.0",
              },
            ),

            {
              type:
                "reached_end",
            },

            "opened",

            "2026-10-04T10:05:00.000Z",
          );

        moduleProgress =
          upsertActivityProgress(
            moduleProgress,
            activityOne,
          );

        moduleProgress =
          upsertActivityProgress(
            moduleProgress,
            activityTwo,
          );

        const summary =
          summarizeModuleProgress(
            moduleProgress,
            [
              "activity-1",
              "activity-2",
              "activity-3",
            ],
          );

        expect(
          summary.status,
        ).toBe(
          "in_progress",
        );

        expect(
          summary.startedActivityCount,
        ).toBe(
          2,
        );

        expect(
          summary.completedActivityCount,
        ).toBe(
          1,
        );

        expect(
          summary.completionRatio,
        ).toBeCloseTo(
          1 / 3,
        );
      },
    );
  },
);