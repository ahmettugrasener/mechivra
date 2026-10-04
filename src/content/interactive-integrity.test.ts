import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  getInteractiveDefinitions,
} from "@/content/interactives";

describe(
  "Interactive content integrity",
  () => {
    it(
      "connects every interactive definition to an existing interactive activity",
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
          of getInteractiveDefinitions()
        ) {
          const activity =
            allActivities.find(
              (candidate) =>
                candidate.id ===
                definition.activityId,
            );

          expect(
            activity,
          ).toBeDefined();

          expect(
            activity?.type,
          ).toBe(
            "interactive",
          );

          expect(
            activity?.completionRule.type,
          ).toBe(
            "meaningful_interaction",
          );
        }
      },
    );
  },
);