import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getActivitiesForModule,
} from "@/content/registry";

import {
  getWorkedExampleDefinitions,
} from "@/content/worked-examples";

describe(
  "Worked-example content integrity",
  () => {
    it(
      "connects every worked example to an existing learning activity",
      () => {
        const activities = [
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
          of getWorkedExampleDefinitions()
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

          expect([
            "concept",
            "worked_example",
          ]).toContain(
            activity?.type,
          );
        }
      },
    );
  },
);