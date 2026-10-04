import {
  describe,
  expect,
  it,
} from "vitest";

import {
  IDEAL_OTTO_MODEL_KIND,
  createIdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

import {
  IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

const referenceInput = {
  compressionRatio:
    8,

  initialTemperatureK:
    300,

  initialPressurePa:
    100_000,

  heatInputJPerKg:
    800_000,
} as const;

describe(
  "Ideal Otto canonical input state",
  () => {
    it(
      "creates the report reference input state",
      () => {
        const result =
          createIdealOttoInputState(
            referenceInput,
          );

        expect(
          result.issues,
        ).toEqual([]);

        expect(
          result.state,
        ).toEqual({
          kind:
            IDEAL_OTTO_MODEL_KIND,

          stateVersion:
            "1.0.0",

          compressionRatio:
            8,

          initialTemperatureK:
            300,

          initialPressurePa:
            100_000,

          heatInputJPerKg:
            800_000,

          gasPropertySetId:
            IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
        });
      },
    );

    it(
      "defaults to the approved reference air property set",
      () => {
        const result =
          createIdealOttoInputState(
            referenceInput,
          );

        expect(
          result.state
            ?.gasPropertySetId,
        ).toBe(
          IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
        );
      },
    );

    it(
      "accepts the approved property-set ID explicitly",
      () => {
        const result =
          createIdealOttoInputState(
            {
              ...referenceInput,

              gasPropertySetId:
                IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
            },
          );

        expect(
          result.state,
        ).not.toBeNull();

        expect(
          result.issues,
        ).toEqual([]);
      },
    );

    it(
      "rejects compression ratio less than or equal to one",
      () => {
        for (
          const compressionRatio
          of [
            1,
            0.5,
            0,
            -1,
          ]
        ) {
          const result =
            createIdealOttoInputState(
              {
                ...referenceInput,

                compressionRatio,
              },
            );

          expect(
            result.state,
          ).toBeNull();

          expect(
            result.issues.some(
              (issue) =>
                issue.code ===
                "invalid_compression_ratio",
            ),
          ).toBe(true);
        }
      },
    );

    it(
      "rejects non-positive absolute temperature",
      () => {
        const result =
          createIdealOttoInputState(
            {
              ...referenceInput,

              initialTemperatureK:
                0,
            },
          );

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues[0]
            ?.code,
        ).toBe(
          "invalid_initial_temperature",
        );
      },
    );

    it(
      "rejects non-positive absolute pressure",
      () => {
        const result =
          createIdealOttoInputState(
            {
              ...referenceInput,

              initialPressurePa:
                -1,
            },
          );

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues[0]
            ?.code,
        ).toBe(
          "invalid_initial_pressure",
        );
      },
    );

    it(
      "rejects non-positive heat input",
      () => {
        const result =
          createIdealOttoInputState(
            {
              ...referenceInput,

              heatInputJPerKg:
                0,
            },
          );

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues[0]
            ?.code,
        ).toBe(
          "invalid_heat_input",
        );
      },
    );

    it(
      "rejects NaN and infinite physical inputs",
      () => {
        const invalidValues = [
          Number.NaN,
          Number.POSITIVE_INFINITY,
          Number.NEGATIVE_INFINITY,
        ];

        for (
          const value
          of invalidValues
        ) {
          expect(
            createIdealOttoInputState(
              {
                ...referenceInput,

                compressionRatio:
                  value,
              },
            ).state,
          ).toBeNull();

          expect(
            createIdealOttoInputState(
              {
                ...referenceInput,

                initialTemperatureK:
                  value,
              },
            ).state,
          ).toBeNull();

          expect(
            createIdealOttoInputState(
              {
                ...referenceInput,

                initialPressurePa:
                  value,
              },
            ).state,
          ).toBeNull();

          expect(
            createIdealOttoInputState(
              {
                ...referenceInput,

                heatInputJPerKg:
                  value,
              },
            ).state,
          ).toBeNull();
        }
      },
    );

    it(
      "rejects unsupported gas-property sets",
      () => {
        const result =
          createIdealOttoInputState(
            {
              ...referenceInput,

              gasPropertySetId:
                "custom-user-gas",
            },
          );

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues.some(
            (issue) =>
              issue.code ===
              "unsupported_gas_property_set",
          ),
        ).toBe(true);
      },
    );

    it(
      "collects multiple input issues deterministically",
      () => {
        const result =
          createIdealOttoInputState(
            {
              compressionRatio:
                1,

              initialTemperatureK:
                0,

              initialPressurePa:
                0,

              heatInputJPerKg:
                0,
            },
          );

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues.map(
            (issue) =>
              issue.code,
          ),
        ).toEqual([
          "invalid_compression_ratio",
          "invalid_initial_temperature",
          "invalid_initial_pressure",
          "invalid_heat_input",
        ]);
      },
    );

    it(
      "is deterministic for identical inputs",
      () => {
        const first =
          createIdealOttoInputState(
            referenceInput,
          );

        const second =
          createIdealOttoInputState(
            referenceInput,
          );

        expect(
          second,
        ).toEqual(
          first,
        );
      },
    );
  },
);