import {
  describe,
  expect,
  it,
} from "vitest";

import {
  IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
  IdealGasPropertySetError,
  createConstantSpecificHeatIdealGasPropertySet,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

describe(
  "Ideal Otto constant-specific-heat gas properties",
  () => {
    it(
      "creates the report reference air property set",
      () => {
        expect(
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES
            .gasConstantJPerKgK,
        ).toBe(287);

        expect(
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES
            .gamma,
        ).toBe(1.4);

        expect(
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES
            .cvJPerKgK,
        ).toBeCloseTo(
          717.5,
          12,
        );

        expect(
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES
            .cpJPerKgK,
        ).toBeCloseTo(
          1004.5,
          12,
        );
      },
    );

    it(
      "preserves cp minus cv equals R",
      () => {
        const gas =
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES;

        expect(
          gas.cpJPerKgK -
            gas.cvJPerKgK,
        ).toBeCloseTo(
          gas.gasConstantJPerKgK,
          12,
        );
      },
    );

    it(
      "preserves gamma equals cp divided by cv",
      () => {
        const gas =
          IDEAL_OTTO_REFERENCE_AIR_PROPERTIES;

        expect(
          gas.cpJPerKgK /
            gas.cvJPerKgK,
        ).toBeCloseTo(
          gas.gamma,
          12,
        );
      },
    );

    it(
      "derives a different internally consistent property set",
      () => {
        const gas =
          createConstantSpecificHeatIdealGasPropertySet(
            {
              id:
                "test-gas",

              gasConstantJPerKgK:
                300,

              gamma:
                1.5,
            },
          );

        expect(
          gas.cvJPerKgK,
        ).toBeCloseTo(
          600,
          12,
        );

        expect(
          gas.cpJPerKgK,
        ).toBeCloseTo(
          900,
          12,
        );
      },
    );

    it(
      "rejects non-positive or non-finite gas constants",
      () => {
        for (
          const value
          of [
            0,
            -287,
            Number.NaN,
            Number.POSITIVE_INFINITY,
          ]
        ) {
          expect(
            () =>
              createConstantSpecificHeatIdealGasPropertySet(
                {
                  id:
                    "invalid-r",

                  gasConstantJPerKgK:
                    value,

                  gamma:
                    1.4,
                },
              ),
          ).toThrow(
            IdealGasPropertySetError,
          );
        }
      },
    );

    it(
      "rejects gamma values that cannot define positive finite specific heats",
      () => {
        for (
          const gamma
          of [
            1,
            0.9,
            Number.NaN,
            Number.POSITIVE_INFINITY,
          ]
        ) {
          expect(
            () =>
              createConstantSpecificHeatIdealGasPropertySet(
                {
                  id:
                    "invalid-gamma",

                  gasConstantJPerKgK:
                    287,

                  gamma,
                },
              ),
          ).toThrow(
            IdealGasPropertySetError,
          );
        }
      },
    );

    it(
      "rejects an empty property-set ID",
      () => {
        expect(
          () =>
            createConstantSpecificHeatIdealGasPropertySet(
              {
                id:
                  "   ",

                gasConstantJPerKgK:
                  287,

                gamma:
                  1.4,
              },
            ),
        ).toThrow(
          IdealGasPropertySetError,
        );
      },
    );
  },
);