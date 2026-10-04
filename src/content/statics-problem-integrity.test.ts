import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  getNumericProblemDefinitions,
} from "@/content/statics-problems";

describe(
  "Statics numeric problem integrity",
  () => {
    it(
      "connects every numeric problem to a submitted-attempt activity",
      () => {
        const activities =
          getActivitiesForModule(
            "module-simply-supported-beam",
          );

        for (
          const definition
          of getNumericProblemDefinitions()
        ) {
          const activity =
            activities.find(
              (candidate) =>
                candidate.id ===
                definition.activityId,
            );

          expect(
            activity,
          ).toBeDefined();

          expect(
            activity?.type,
          ).toBe("problem");

          expect(
            activity
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