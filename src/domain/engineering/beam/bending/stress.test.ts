import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createRectangularSectionProperties,
} from "@/domain/engineering/beam/bending/section";

import {
  BendingStressCalculationError,
  calculateBendingNormalStressPa,
  createRectangularBendingStressDistribution,
} from "@/domain/engineering/beam/bending/stress";

describe(
  "Elementary beam bending stress",
  () => {
    const section =
      createRectangularSectionProperties(
        {
          kind:
            "rectangular",

          widthM:
            0.1,

          heightM:
            0.2,
        },
      );

    it(
      "calculates zero stress at the neutral axis",
      () => {
        expect(
          calculateBendingNormalStressPa(
            10_000,
            0,
            section.secondMomentAreaM4,
          ),
        ).toBe(0);
      },
    );

    it(
      "produces compression at the top and tension at the bottom for positive sagging moment",
      () => {
        const stress =
          createRectangularBendingStressDistribution(
            10_000,
            section,
          );

        expect(
          stress.topFiberStressPa,
        ).toBeCloseTo(
          -15_000_000,
          6,
        );

        expect(
          stress.neutralAxisStressPa,
        ).toBe(0);

        expect(
          stress.bottomFiberStressPa,
        ).toBeCloseTo(
          15_000_000,
          6,
        );

        expect(
          stress.maximumAbsoluteStressPa,
        ).toBeCloseTo(
          15_000_000,
          6,
        );
      },
    );

    it(
      "varies linearly through the section depth",
      () => {
        const top =
          calculateBendingNormalStressPa(
            10_000,
            0.1,
            section.secondMomentAreaM4,
          );

        const halfway =
          calculateBendingNormalStressPa(
            10_000,
            0.05,
            section.secondMomentAreaM4,
          );

        expect(
          halfway,
        ).toBeCloseTo(
          top / 2,
          8,
        );
      },
    );

    it(
      "reverses tension and compression when moment sign reverses",
      () => {
        const positive =
          createRectangularBendingStressDistribution(
            10_000,
            section,
          );

        const negative =
          createRectangularBendingStressDistribution(
            -10_000,
            section,
          );

        expect(
          negative.topFiberStressPa,
        ).toBeCloseTo(
          -positive.topFiberStressPa,
          8,
        );

        expect(
          negative.bottomFiberStressPa,
        ).toBeCloseTo(
          -positive.bottomFiberStressPa,
          8,
        );

        expect(
          negative.maximumAbsoluteStressPa,
        ).toBeCloseTo(
          positive.maximumAbsoluteStressPa,
          8,
        );
      },
    );

    it(
      "returns zero stress everywhere for zero moment",
      () => {
        const stress =
          createRectangularBendingStressDistribution(
            0,
            section,
          );

        expect(
          stress.topFiberStressPa,
        ).toBe(0);

        expect(
          stress.neutralAxisStressPa,
        ).toBe(0);

        expect(
          stress.bottomFiberStressPa,
        ).toBe(0);

        expect(
          stress.maximumAbsoluteStressPa,
        ).toBe(0);
      },
    );

    it(
      "rejects an invalid second moment of area",
      () => {
        expect(
          () =>
            calculateBendingNormalStressPa(
              10_000,
              0.1,
              0,
            ),
        ).toThrow(
          BendingStressCalculationError,
        );
      },
    );

    it(
      "rejects non-finite moment or fiber coordinate",
      () => {
        expect(
          () =>
            calculateBendingNormalStressPa(
              Number.NaN,
              0.1,
              section.secondMomentAreaM4,
            ),
        ).toThrow(
          BendingStressCalculationError,
        );

        expect(
          () =>
            calculateBendingNormalStressPa(
              10_000,
              Number.POSITIVE_INFINITY,
              section.secondMomentAreaM4,
            ),
        ).toThrow(
          BendingStressCalculationError,
        );
      },
    );
  },
);