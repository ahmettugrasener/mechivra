import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
} from "@/content/registry";

const MODULE_CONTRACTS =
  [
    {
      moduleId:
        "module-simply-supported-beam",

      activityIds: [
        "activity-ssb-01",
        "activity-ssb-02",
        "activity-ssb-03",
        "activity-ssb-04",
        "activity-ssb-05",
        "activity-ssb-06",
      ],
    },

    {
      moduleId:
        "module-bending",

      activityIds: [
        "activity-bending-01",
        "activity-bending-02",
        "activity-bending-03",
        "activity-bending-04",
        "activity-bending-05",
        "activity-bending-06",
      ],
    },

    {
      moduleId:
        "module-ideal-otto-cycle",

      activityIds: [
        "activity-otto-01",
        "activity-otto-02",
        "activity-otto-03",
        "activity-otto-04",
        "activity-otto-05",
        "activity-otto-06",
      ],
    },
  ] as const;

const EXPECTED_ACTIVITY_TYPES =
  [
    "problem_context",
    "concept",
    "prediction",
    "interactive",
    "problem",
    "summary",
  ] as const;

const EXPECTED_COMPLETION_RULES =
  [
    "reached_end",
    "reached_end",
    "submitted_prediction",
    "meaningful_interaction",
    "submitted_attempt",
    "reached_end",
  ] as const;

describe(
  "MVP module contract",
  () => {
    it.each(
      MODULE_CONTRACTS,
    )(
      "$moduleId contains exactly the canonical six-step learning sequence",
      (
        contract,
      ) => {
        const activities =
          getActivitiesForModule(
            contract.moduleId,
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
              activity.id,
          ),
        ).toEqual(
          contract.activityIds,
        );

        expect(
          activities.map(
            (
              activity,
            ) =>
              activity.order,
          ),
        ).toEqual(
          [
            1,
            2,
            3,
            4,
            5,
            6,
          ],
        );
      },
    );

    it.each(
      MODULE_CONTRACTS,
    )(
      "$moduleId keeps the same pedagogical activity-type sequence",
      (
        contract,
      ) => {
        const activities =
          getActivitiesForModule(
            contract.moduleId,
          );

        expect(
          activities.map(
            (
              activity,
            ) =>
              activity.type,
          ),
        ).toEqual(
          EXPECTED_ACTIVITY_TYPES,
        );
      },
    );

    it.each(
      MODULE_CONTRACTS,
    )(
      "$moduleId keeps completion semantics aligned with activity purpose",
      (
        contract,
      ) => {
        const activities =
          getActivitiesForModule(
            contract.moduleId,
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
          EXPECTED_COMPLETION_RULES,
        );
      },
    );

    it.each(
      MODULE_CONTRACTS,
    )(
      "$moduleId keeps every activity owned by the correct module",
      (
        contract,
      ) => {
        const activities =
          getActivitiesForModule(
            contract.moduleId,
          );

        for (
          const activity
          of activities
        ) {
          expect(
            activity.moduleId,
          ).toBe(
            contract.moduleId,
          );
        }
      },
    );

    it.each(
      MODULE_CONTRACTS,
    )(
      "$moduleId provides complete Turkish and English activity titles",
      (
        contract,
      ) => {
        const activities =
          getActivitiesForModule(
            contract.moduleId,
          );

        for (
          const activity
          of activities
        ) {
          expect(
            activity.title.tr
              .trim().length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            activity.title.en
              .trim().length,
          ).toBeGreaterThan(
            0,
          );
        }
      },
    );

    it.each(
      MODULE_CONTRACTS,
    )(
      "$moduleId keeps learning outcomes, concepts, and sources attached to every activity",
      (
        contract,
      ) => {
        const activities =
          getActivitiesForModule(
            contract.moduleId,
          );

        for (
          const activity
          of activities
        ) {
          expect(
            activity
              .learningOutcomeIds
              .length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            activity
              .conceptIds
              .length,
          ).toBeGreaterThan(
            0,
          );

          expect(
            activity
              .sourceIds
              .length,
          ).toBeGreaterThan(
            0,
          );
        }
      },
    );

    it(
      "keeps all eighteen MVP activity IDs globally unique",
      () => {
        const activityIds =
          MODULE_CONTRACTS.flatMap(
            (
              contract,
            ) =>
              getActivitiesForModule(
                contract.moduleId,
              ).map(
                (
                  activity,
                ) =>
                  activity.id,
              ),
          );

        expect(
          activityIds,
        ).toHaveLength(
          18,
        );

        expect(
          new Set(
            activityIds,
          ).size,
        ).toBe(
          18,
        );
      },
    );

    it(
      "keeps prediction, interactive, and problem positions consistent across all MVP modules",
      () => {
        for (
          const contract
          of MODULE_CONTRACTS
        ) {
          const activities =
            getActivitiesForModule(
              contract.moduleId,
            );

          expect(
            activities[2]
              ?.type,
          ).toBe(
            "prediction",
          );

          expect(
            activities[2]
              ?.completionRule
              .type,
          ).toBe(
            "submitted_prediction",
          );

          expect(
            activities[3]
              ?.type,
          ).toBe(
            "interactive",
          );

          expect(
            activities[3]
              ?.completionRule
              .type,
          ).toBe(
            "meaningful_interaction",
          );

          expect(
            activities[4]
              ?.type,
          ).toBe(
            "problem",
          );

          expect(
            activities[4]
              ?.completionRule
              .type,
          ).toBe(
            "submitted_attempt",
          );
        }
      },
    );
  },
);