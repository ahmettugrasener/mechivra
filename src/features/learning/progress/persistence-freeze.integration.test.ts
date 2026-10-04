import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
  getMvpCatalogItems,
} from "@/content/registry";

import {
  ACTIVITY_PROGRESS_VERSION,
  MODULE_PROGRESS_VERSION,
  createActivityProgress,
  createActivityProgressIdentity,
  createModuleProgressIdentity,
} from "@/domain/progress";

import {
  MECHIVRA_DATABASE_VERSION,
} from "@/infrastructure/persistence";

const EXPECTED_COMPLETION_CONTRACT =
  [
    "reached_end",
    "reached_end",
    "submitted_prediction",
    "meaningful_interaction",
    "submitted_attempt",
    "reached_end",
  ] as const;

describe(
  "Phase 8 persistence freeze",
  () => {
    it(
      "freezes the persistence schema and progress model versions",
      () => {
        expect(
          MECHIVRA_DATABASE_VERSION,
        ).toBe(
          2,
        );

        expect(
          ACTIVITY_PROGRESS_VERSION,
        ).toBe(
          "1.0.0",
        );

        expect(
          MODULE_PROGRESS_VERSION,
        ).toBe(
          "1.0.0",
        );
      },
    );

    it(
      "keeps the MVP persistence scope at three modules and eighteen activities",
      () => {
        const catalog =
          getMvpCatalogItems();

        expect(
          catalog,
        ).toHaveLength(
          3,
        );

        const activities =
          catalog.flatMap(
            (
              item,
            ) =>
              getActivitiesForModule(
                item.module.id,
              ),
          );

        expect(
          activities,
        ).toHaveLength(
          18,
        );

        expect(
          new Set(
            activities.map(
              (
                activity,
              ) =>
                activity.id,
            ),
          ).size,
        ).toBe(
          18,
        );
      },
    );

    it(
      "freezes the six-step completion contract for every MVP module",
      () => {
        for (
          const item
          of getMvpCatalogItems()
        ) {
          const activities =
            [
              ...getActivitiesForModule(
                item.module.id,
              ),
            ].sort(
              (
                left,
                right,
              ) =>
                left.order -
                right.order,
            );

          expect(
            activities,
          ).toHaveLength(
            6,
          );

          expect(
            activities.map(
              (
                activity,
              ) =>
                activity
                  .completionRule
                  .type,
            ),
          ).toEqual(
            EXPECTED_COMPLETION_CONTRACT,
          );

          expect(
            activities.map(
              (
                activity,
              ) =>
                activity.order,
            ),
          ).toEqual([
            1,
            2,
            3,
            4,
            5,
            6,
          ]);
        }
      },
    );

    it(
      "keeps progress identities locale-neutral",
      () => {
        const activityIdentity =
          createActivityProgressIdentity(
            "module-test",
            "1.0.0",
            "activity-test",
            "1.0.0",
          );

        const moduleIdentity =
          createModuleProgressIdentity(
            "module-test",
            "1.0.0",
          );

        expect(
          activityIdentity,
        ).toEqual({
          moduleId:
            "module-test",

          moduleVersion:
            "1.0.0",

          activityId:
            "activity-test",

          activityVersion:
            "1.0.0",
        });

        expect(
          moduleIdentity,
        ).toEqual({
          moduleId:
            "module-test",

          moduleVersion:
            "1.0.0",
        });

        expect(
          "locale" in
            activityIdentity,
        ).toBe(
          false,
        );

        expect(
          "locale" in
            moduleIdentity,
        ).toBe(
          false,
        );
      },
    );

    it(
      "keeps completion separate from correctness and mastery",
      () => {
        const progress =
          createActivityProgress({
            moduleId:
              "module-test",

            moduleVersion:
              "1.0.0",

            activityId:
              "activity-test",

            activityVersion:
              "1.0.0",
          });

        expect(
          "correct" in
            progress,
        ).toBe(
          false,
        );

        expect(
          "mastered" in
            progress,
        ).toBe(
          false,
        );

        expect(
          "score" in
            progress,
        ).toBe(
          false,
        );

        expect(
          "locale" in
            progress,
        ).toBe(
          false,
        );
      },
    );

    it(
      "keeps module progress derived from current curriculum activities",
      () => {
        for (
          const item
          of getMvpCatalogItems()
        ) {
          const activities =
            getActivitiesForModule(
              item.module.id,
            );

          expect(
            activities.every(
              (
                activity,
              ) =>
                activity.moduleId ===
                item.module.id,
            ),
          ).toBe(
            true,
          );

          expect(
            activities.every(
              (
                activity,
              ) =>
                activity.version
                  .trim()
                  .length >
                0,
            ),
          ).toBe(
            true,
          );

          expect(
            item.module.version
              .trim()
              .length,
          ).toBeGreaterThan(
            0,
          );
        }
      },
    );
  },
);