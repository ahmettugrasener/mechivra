import {
  describe,
  expect,
  it,
} from "vitest";

import {
  NumericToleranceError,
  evaluateNumericTolerance,
  validateNumericTolerance,
} from "@/domain/assessment/numeric-tolerance";

describe(
  "Unified numeric tolerance",
  () => {
    it(
      "accepts a value inside absolute tolerance",
      () => {
        const result =
          evaluateNumericTolerance(
            10.04,
            10,
            {
              absolute:
                0.05,

              relative:
                0,
            },
          );

        expect(
          result.withinTolerance,
        ).toBe(true);

        expect(
          result.allowedDifference,
        ).toBeCloseTo(
          0.05,
          12,
        );
      },
    );

    it(
      "accepts a value inside relative tolerance",
      () => {
        const result =
          evaluateNumericTolerance(
            100.5,
            100,
            {
              absolute:
                0.01,

              relative:
                0.01,
            },
          );

        expect(
          result.withinTolerance,
        ).toBe(true);

        expect(
          result.allowedDifference,
        ).toBeCloseTo(
          1,
          12,
        );
      },
    );

    it(
      "uses the larger of absolute and relative tolerance",
      () => {
        const result =
          evaluateNumericTolerance(
            0.0004,
            0,
            {
              absolute:
                0.001,

              relative:
                0.01,
            },
          );

        expect(
          result.allowedDifference,
        ).toBeCloseTo(
          0.001,
          12,
        );

        expect(
          result.withinTolerance,
        ).toBe(true);

        expect(
          result.relativeDifference,
        ).toBeNull();
      },
    );

    it(
      "does not increase tolerance because the submitted answer is very large",
      () => {
        const result =
          evaluateNumericTolerance(
            1_000_000,
            100,
            {
              absolute:
                0.1,

              relative:
                0.01,
            },
          );

        expect(
          result.allowedDifference,
        ).toBeCloseTo(
          1,
          12,
        );

        expect(
          result.withinTolerance,
        ).toBe(false);
      },
    );

    it(
      "rejects NaN and infinite submitted values without throwing",
      () => {
        for (
          const actual
          of [
            Number.NaN,
            Number.POSITIVE_INFINITY,
            Number.NEGATIVE_INFINITY,
          ]
        ) {
          const result =
            evaluateNumericTolerance(
              actual,
              10,
              {
                absolute:
                  0.1,

                relative:
                  0.01,
              },
            );

          expect(
            result.withinTolerance,
          ).toBe(false);
        }
      },
    );

    it(
      "rejects non-finite expected values",
      () => {
        expect(
          () =>
            evaluateNumericTolerance(
              10,
              Number.NaN,
              {
                absolute:
                  0.1,

                relative:
                  0.01,
              },
            ),
        ).toThrow(
          NumericToleranceError,
        );
      },
    );

    it(
      "rejects invalid tolerance definitions",
      () => {
        expect(
          () =>
            validateNumericTolerance(
              {
                absolute:
                  -1,

                relative:
                  0.01,
              },
            ),
        ).toThrow(
          NumericToleranceError,
        );

        expect(
          () =>
            validateNumericTolerance(
              {
                absolute:
                  0,

                relative:
                  0,
              },
            ),
        ).toThrow(
          NumericToleranceError,
        );
      },
    );
  },
);