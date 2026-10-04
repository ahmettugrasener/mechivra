import {
  describe,
  expect,
  it,
} from "vitest";

import {
  getNumericProblemDefinition,
  getNumericProblemDefinitions,
} from "@/content/statics-problems";

describe(
  "Statics numeric problem registry",
  () => {
    it(
      "contains the independent Statics problem",
      () => {
        const definition =
          getNumericProblemDefinition(
            "activity-ssb-05",
          );

        expect(
          definition,
        ).toBeDefined();

        expect(
          definition?.input,
        ).toEqual({
          spanM: 6,
          pointLoadKN: 12,
          loadPositionM: 2,
        });

        expect(
          definition?.fields,
        ).toHaveLength(6);
      },
    );

    it(
      "uses unique definition and activity IDs",
      () => {
        const definitions =
          getNumericProblemDefinitions();

        expect(
          new Set(
            definitions.map(
              (definition) =>
                definition.id,
            ),
          ).size,
        ).toBe(
          definitions.length,
        );

        expect(
          new Set(
            definitions.map(
              (definition) =>
                definition.activityId,
            ),
          ).size,
        ).toBe(
          definitions.length,
        );
      },
    );

    it(
      "uses six unique answer roles",
      () => {
        const definition =
          getNumericProblemDefinition(
            "activity-ssb-05",
          );

        if (!definition) {
          throw new Error(
            "Expected Statics numeric problem.",
          );
        }

        const roles =
          definition.fields.map(
            (field) =>
              field.answerRole,
          );

        expect(
          new Set(
            roles,
          ).size,
        ).toBe(6);
      },
    );
  },
);