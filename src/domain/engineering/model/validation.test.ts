import {
  describe,
  expect,
  it,
} from "vitest";

import {
  collectValidityIssues,
  validateExclusiveRange,
  validateFiniteNumber,
  validateGreaterThan,
  validateGreaterThanOrEqual,
} from "@/domain/engineering/model";

describe(
  "Engineering validation helpers",
  () => {
    it(
      "accepts finite numbers",
      () => {
        expect(
          validateFiniteNumber(
            "length",
            4,
          ),
        ).toBeNull();
      },
    );

    it(
      "rejects NaN",
      () => {
        expect(
          validateFiniteNumber(
            "length",
            Number.NaN,
          ),
        ).toEqual({
          code: "not_finite",
          field: "length",
          messageKey:
            "engineering.validation.notFinite",
        });
      },
    );

    it(
      "rejects infinity",
      () => {
        const issue =
          validateFiniteNumber(
            "load",
            Number.POSITIVE_INFINITY,
          );

        expect(
          issue?.code,
        ).toBe("not_finite");
      },
    );

    it(
      "validates strict lower bounds",
      () => {
        expect(
          validateGreaterThan(
            "span",
            4,
            0,
          ),
        ).toBeNull();

        expect(
          validateGreaterThan(
            "span",
            0,
            0,
          )?.code,
        ).toBe(
          "must_be_greater_than",
        );
      },
    );

    it(
      "validates inclusive lower bounds",
      () => {
        expect(
          validateGreaterThanOrEqual(
            "load",
            0,
            0,
          ),
        ).toBeNull();

        expect(
          validateGreaterThanOrEqual(
            "load",
            -1,
            0,
          )?.code,
        ).toBe(
          "must_be_greater_than_or_equal",
        );
      },
    );

    it(
      "validates exclusive ranges",
      () => {
        expect(
          validateExclusiveRange(
            "loadPosition",
            2,
            0,
            4,
          ),
        ).toBeNull();

        expect(
          validateExclusiveRange(
            "loadPosition",
            0,
            0,
            4,
          )?.code,
        ).toBe(
          "outside_exclusive_range",
        );

        expect(
          validateExclusiveRange(
            "loadPosition",
            4,
            0,
            4,
          )?.code,
        ).toBe(
          "outside_exclusive_range",
        );
      },
    );

    it(
      "collects only actual validity issues",
      () => {
        const issues =
          collectValidityIssues([
            null,

            validateGreaterThan(
              "span",
              0,
              0,
            ),

            null,

            validateGreaterThanOrEqual(
              "load",
              -5,
              0,
            ),
          ]);

        expect(
          issues,
        ).toHaveLength(2);

        expect(
          issues.map(
            (issue) =>
              issue.field,
          ),
        ).toEqual([
          "span",
          "load",
        ]);
      },
    );
  },
);