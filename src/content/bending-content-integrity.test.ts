import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getBendingActivityContentDefinitions,
} from "@/content/bending-content";

import {
  getActivitiesForModule,
} from "@/content/registry";

describe(
  "Bending content integration integrity",
  () => {
    it(
      "maps one content definition to every Bending learning activity",
      () => {
        const activities =
          getActivitiesForModule(
            "module-bending",
          );

        const definitions =
          getBendingActivityContentDefinitions();

        expect(
          activities,
        ).toHaveLength(6);

        expect(
          definitions,
        ).toHaveLength(6);

        expect(
          definitions.map(
            (definition) =>
              definition.activityId,
          ),
        ).toEqual(
          activities.map(
            (activity) =>
              activity.id,
          ),
        );
      },
    );

    it(
      "preserves the intended six-step Bending activity sequence",
      () => {
        const activities =
          getActivitiesForModule(
            "module-bending",
          );

        expect(
          activities.map(
            (activity) => ({
              id:
                activity.id,

              type:
                activity.type,

              order:
                activity.order,
            }),
          ),
        ).toEqual([
          {
            id:
              "activity-bending-01",

            type:
              "problem_context",

            order:
              1,
          },

          {
            id:
              "activity-bending-02",

            type:
              "concept",

            order:
              2,
          },

          {
            id:
              "activity-bending-03",

            type:
              "prediction",

            order:
              3,
          },

          {
            id:
              "activity-bending-04",

            type:
              "interactive",

            order:
              4,
          },

          {
            id:
              "activity-bending-05",

            type:
              "problem",

            order:
              5,
          },

          {
            id:
              "activity-bending-06",

            type:
              "summary",

            order:
              6,
          },
        ]);
      },
    );
  },
);