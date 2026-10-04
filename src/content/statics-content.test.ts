import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
} from "@/content/registry";

import type {
  LearningActivity,
} from "@/domain/learning/types";

function getStaticsActivity(
  activityId: string,
): LearningActivity {
  const activity =
    getActivitiesForModule(
      "module-simply-supported-beam",
    ).find(
      (candidate) =>
        candidate.id ===
        activityId,
    );

  if (!activity) {
    throw new Error(
      `Expected Statics activity "${activityId}".`,
    );
  }

  return activity;
}

describe(
  "Statics scientific and pedagogical content",
  () => {
    it(
      "contains six Statics learning activities",
      () => {
        const activities =
          getActivitiesForModule(
            "module-simply-supported-beam",
          );

        expect(
          activities,
        ).toHaveLength(6);
      },
    );

    it(
      "provides real content blocks for every Statics activity",
      () => {
        const activities =
          getActivitiesForModule(
            "module-simply-supported-beam",
          );

        for (
          const activity
          of activities
        ) {
          expect(
            activity.contentBlocks.length,
            `${activity.id} should contain learning content`,
          ).toBeGreaterThan(0);
        }
      },
    );

    it(
      "uses version 1.1.0 for the revised Statics activities",
      () => {
        const activities =
          getActivitiesForModule(
            "module-simply-supported-beam",
          );

        for (
          const activity
          of activities
        ) {
          expect(
            activity.version,
          ).toBe("1.1.0");
        }
      },
    );

    it(
      "uses unique content-block IDs throughout the Statics module",
      () => {
        const blockIds =
          getActivitiesForModule(
            "module-simply-supported-beam",
          ).flatMap(
            (activity) =>
              activity.contentBlocks.map(
                (block) =>
                  block.id,
              ),
          );

        expect(
          new Set(
            blockIds,
          ).size,
        ).toBe(
          blockIds.length,
        );
      },
    );

    it(
      "contains the required equilibrium equations in the concept activity",
      () => {
        const activity =
          getStaticsActivity(
            "activity-ssb-02",
          );

        const equations =
          activity.contentBlocks
            .filter(
              (block) =>
                block.type ===
                "equation",
            )
            .map(
              (block) =>
                block.expression,
            );

        expect(
          equations,
        ).toEqual([
          "\\sum F_y = R_A + R_B - P = 0",
          "\\sum M_A = R_B L - P a = 0",
          "R_B = \\frac{P a}{L}",
          "R_A = P - R_B = \\frac{P(L-a)}{L}",
        ]);
      },
    );

    it(
      "keeps the prediction activity focused on prediction before feedback",
      () => {
        const activity =
          getStaticsActivity(
            "activity-ssb-03",
          );

        expect(
          activity.type,
        ).toBe(
          "prediction",
        );

        expect(
          activity.completionRule.type,
        ).toBe(
          "submitted_prediction",
        );

        expect(
          activity.contentBlocks.length,
        ).toBeGreaterThan(0);
      },
    );

    it(
      "connects the interactive activity to observation-oriented content",
      () => {
        const activity =
          getStaticsActivity(
            "activity-ssb-04",
          );

        expect(
          activity.type,
        ).toBe(
          "interactive",
        );

        expect(
          activity.completionRule.type,
        ).toBe(
          "meaningful_interaction",
        );
      },
    );

    it(
      "keeps the new problem separate from a worked answer",
      () => {
        const activity =
          getStaticsActivity(
            "activity-ssb-05",
          );

        expect(
          activity.type,
        ).toBe("problem");

        expect(
          activity.completionRule.type,
        ).toBe(
          "submitted_attempt",
        );

        const equations =
          activity.contentBlocks.filter(
            (block) =>
              block.type ===
              "equation",
          );

        expect(
          equations,
        ).toHaveLength(0);
      },
    );

    it(
      "states explicit model limitations in the summary",
      () => {
        const activity =
          getStaticsActivity(
            "activity-ssb-06",
          );

        const warning =
          activity.contentBlocks.find(
            (block) =>
              block.type ===
                "callout" &&
              block.tone ===
                "warning",
          );

        expect(
          warning,
        ).toBeDefined();
      },
    );

    it(
      "keeps the scientific source attached to every Statics activity",
      () => {
        const activities =
          getActivitiesForModule(
            "module-simply-supported-beam",
          );

        for (
          const activity
          of activities
        ) {
          expect(
            activity.sourceIds,
          ).toContain(
            "source-mit-beam-displacements",
          );
        }
      },
    );
  },
);