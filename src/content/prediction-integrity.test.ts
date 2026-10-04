import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  getPredictionDefinitions,
} from "@/content/predictions";

describe(
  "Prediction content integrity",
  () => {
    it(
      "connects every prediction definition to an existing prediction activity",
      () => {
        const allActivities = [
          ...getActivitiesForModule(
            "module-simply-supported-beam",
          ),

          ...getActivitiesForModule(
            "module-bending",
          ),

          ...getActivitiesForModule(
            "module-ideal-otto-cycle",
          ),
        ];

        for (
          const definition
          of getPredictionDefinitions()
        ) {
          const activity =
            allActivities.find(
              (
                candidate,
              ) =>
                candidate.id ===
                definition.activityId,
            );

          expect(
            activity,
          ).toBeDefined();

          expect(
            activity?.type,
          ).toBe(
            "prediction",
          );

          expect(
            activity?.completionRule.type,
          ).toBe(
            "submitted_prediction",
          );
        }
      },
    );
  },
);