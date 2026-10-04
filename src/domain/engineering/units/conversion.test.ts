import {
  describe,
  expect,
  it,
} from "vitest";

import {
  UnitConversionError,
  convertUnit,
  createQuantity,
  fromSI,
  getCanonicalUnit,
  isUnitCompatible,
  toSI,
} from "@/domain/engineering/units";

describe(
  "Engineering unit conversion",
  () => {
    it(
      "converts kilonewtons to canonical newtons",
      () => {
        expect(
          toSI(
            "force",
            10,
            "kN",
          ),
        ).toBe(10_000);
      },
    );

    it(
      "converts millimetres to metres",
      () => {
        expect(
          toSI(
            "length",
            250,
            "mm",
          ),
        ).toBeCloseTo(
          0.25,
          12,
        );
      },
    );

    it(
      "converts gigapascals to pascals for elastic modulus",
      () => {
        expect(
          toSI(
            "elastic_modulus",
            200,
            "GPa",
          ),
        ).toBe(
          200_000_000_000,
        );
      },
    );

    it(
      "converts megapascals to pascals for stress",
      () => {
        expect(
          toSI(
            "stress",
            15,
            "MPa",
          ),
        ).toBe(
          15_000_000,
        );
      },
    );

    it(
      "converts kilonewton metres to newton metres",
      () => {
        expect(
          toSI(
            "moment",
            10,
            "kN_m",
          ),
        ).toBe(10_000);
      },
    );

    it(
      "converts millimetres to the fourth power correctly",
      () => {
        expect(
          toSI(
            "second_moment_area",
            1,
            "mm4",
          ),
        ).toBeCloseTo(
          1e-12,
          24,
        );
      },
    );

    it(
      "converts Celsius absolute temperature to kelvin",
      () => {
        expect(
          toSI(
            "absolute_temperature",
            25,
            "degC",
          ),
        ).toBeCloseTo(
          298.15,
          12,
        );
      },
    );

    it(
      "keeps Celsius temperature differences offset-free",
      () => {
        expect(
          toSI(
            "temperature_difference",
            25,
            "deltaDegC",
          ),
        ).toBe(25);
      },
    );

    it(
      "converts kilojoules per kilogram to joules per kilogram",
      () => {
        expect(
          toSI(
            "specific_energy",
            800,
            "kJ_per_kg",
          ),
        ).toBe(800_000);
      },
    );

    it(
      "converts litres per kilogram to cubic metres per kilogram",
      () => {
        expect(
          toSI(
            "specific_volume",
            1,
            "L_per_kg",
          ),
        ).toBeCloseTo(
          0.001,
          12,
        );
      },
    );

    it(
      "converts percentages to dimensionless canonical values",
      () => {
        expect(
          toSI(
            "dimensionless",
            56.47,
            "percent",
          ),
        ).toBeCloseTo(
          0.5647,
          12,
        );
      },
    );

    it(
      "round-trips values through canonical SI",
      () => {
        const siValue = toSI(
          "pressure",
          100,
          "kPa",
        );

        expect(
          fromSI(
            "pressure",
            siValue,
            "kPa",
          ),
        ).toBeCloseTo(
          100,
          12,
        );
      },
    );

    it(
      "converts directly between compatible units",
      () => {
        expect(
          convertUnit(
            "length",
            1,
            "m",
            "mm",
          ),
        ).toBeCloseTo(
          1000,
          12,
        );
      },
    );

    it(
      "creates a canonical quantity value",
      () => {
        expect(
          createQuantity(
            "force",
            10,
            "kN",
          ),
        ).toEqual({
          quantity: "force",
          siValue: 10_000,
        });
      },
    );

    it(
      "returns canonical units by quantity",
      () => {
        expect(
          getCanonicalUnit(
            "stress",
          ),
        ).toBe("Pa");

        expect(
          getCanonicalUnit(
            "absolute_temperature",
          ),
        ).toBe("K");

        expect(
          getCanonicalUnit(
            "specific_energy",
          ),
        ).toBe(
          "J_per_kg",
        );
      },
    );

    it(
      "distinguishes absolute temperature from temperature difference units",
      () => {
        expect(
          isUnitCompatible(
            "absolute_temperature",
            "degC",
          ),
        ).toBe(true);

        expect(
          isUnitCompatible(
            "temperature_difference",
            "degC",
          ),
        ).toBe(false);

        expect(
          isUnitCompatible(
            "temperature_difference",
            "deltaDegC",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects incompatible unit and quantity combinations",
      () => {
        expect(
          () =>
            toSI(
              "force",
              10,
              "MPa",
            ),
        ).toThrow(
          UnitConversionError,
        );
      },
    );

    it(
      "rejects non-finite values",
      () => {
        expect(
          () =>
            toSI(
              "length",
              Number.NaN,
              "m",
            ),
        ).toThrow(
          UnitConversionError,
        );

        expect(
          () =>
            toSI(
              "length",
              Number.POSITIVE_INFINITY,
              "m",
            ),
        ).toThrow(
          UnitConversionError,
        );
      },
    );
  },
);