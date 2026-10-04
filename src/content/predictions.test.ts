import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getPredictionDefinition,
  getPredictionDefinitions,
} from "@/content/predictions";

describe(
  "Prediction content registry",
  () => {
    it(
      "contains the Statics load-position prediction",
      () => {
        const definition =
          getPredictionDefinition(
            "activity-ssb-03",
          );

        expect(
          definition,
        ).toBeDefined();

        expect(
          definition?.options,
        ).toHaveLength(3);

        expect(
          definition?.correctOptionId,
        ).toBe(
          "prediction-ssb-reactions-b",
        );
      },
    );

    it(
      "uses unique activity IDs",
      () => {
        const definitions =
          getPredictionDefinitions();

        const ids =
          definitions.map(
            (definition) =>
              definition.activityId,
          );

        expect(
          new Set(ids).size,
        ).toBe(
          ids.length,
        );
      },
    );

    it(
      "returns undefined for an activity without a prediction definition",
      () => {
        expect(
          getPredictionDefinition(
            "activity-ssb-01",
          ),
        ).toBeUndefined();
      },
    );
  },
);