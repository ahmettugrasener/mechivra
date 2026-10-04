import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createInvalidEngineeringResult,
  createValidEngineeringResult,
} from "@/domain/engineering/model";

interface ExampleValues {
  readonly value: number;
}

describe(
  "Engineering result builders",
  () => {
    it(
      "creates a valid result without warnings",
      () => {
        const result =
          createValidEngineeringResult<ExampleValues>(
            {
              modelId:
                "model-example",

              modelVersion:
                "1.0.0",

              values: {
                value: 42,
              },

              assumptions: [
                "assumption-example",
              ],
            },
          );

        expect(
          result.status,
        ).toBe("valid");

        expect(
          result.values,
        ).toEqual({
          value: 42,
        });

        expect(
          result.validity.withinDomain,
        ).toBe(true);

        expect(
          result.validity.issues,
        ).toEqual([]);

        expect(
          result.warnings,
        ).toEqual([]);
      },
    );

    it(
      "creates a valid-with-warning result",
      () => {
        const result =
          createValidEngineeringResult<ExampleValues>(
            {
              modelId:
                "model-example",

              modelVersion:
                "1.0.0",

              values: {
                value: 42,
              },

              assumptions: [
                "assumption-example",
              ],

              warnings: [
                {
                  code:
                    "near-domain-limit",

                  messageKey:
                    "engineering.warning.nearDomainLimit",
                },
              ],
            },
          );

        expect(
          result.status,
        ).toBe(
          "valid_with_warning",
        );

        expect(
          result.values?.value,
        ).toBe(42);

        expect(
          result.warnings,
        ).toHaveLength(1);
      },
    );

    it(
      "creates an invalid result without calculated values",
      () => {
        const result =
          createInvalidEngineeringResult<ExampleValues>(
            {
              modelId:
                "model-example",

              modelVersion:
                "1.0.0",

              assumptions: [
                "assumption-example",
              ],

              issues: [
                {
                  code:
                    "invalid-input",

                  field: "length",

                  messageKey:
                    "engineering.validation.invalidInput",
                },
              ],
            },
          );

        expect(
          result.status,
        ).toBe("invalid");

        expect(
          result.values,
        ).toBeNull();

        expect(
          result.validity.withinDomain,
        ).toBe(false);

        expect(
          result.validity.issues,
        ).toHaveLength(1);
      },
    );

    it(
      "rejects an invalid result with no validity issue",
      () => {
        expect(
          () =>
            createInvalidEngineeringResult(
              {
                modelId:
                  "model-example",

                modelVersion:
                  "1.0.0",

                assumptions: [],

                issues: [],
              },
            ),
        ).toThrow(
          "Invalid engineering results require at least one validity issue.",
        );
      },
    );
  },
);