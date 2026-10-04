import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluateBendingInteractiveState,
} from "@/features/learning/bending/bending-interactive-adapter";

const baseInput = {
  spanM:
    4,

  pointLoadKN:
    10,

  loadPositionM:
    2,

  sectionWidthMm:
    100,

  sectionHeightMm:
    200,

  elasticModulusGPa:
    200,
} as const;

describe(
  "Bending interactive adapter",
  () => {
    it(
      "reproduces the centered independent benchmark",
      () => {
        const result =
          evaluateBendingInteractiveState(
            baseInput,
          );

        expect(
          result.maximumMomentKNm,
        ).toBeCloseTo(
          10,
          10,
        );

        expect(
          result.maximumMomentPositionM,
        ).toBeCloseTo(
          2,
          10,
        );

        expect(
          result.maximumAbsoluteStressMPa,
        ).toBeCloseTo(
          15,
          10,
        );

        expect(
          result.maximumAbsoluteDeflectionMm,
        ).toBeCloseTo(
          1,
          10,
        );

        expect(
          result.maximumDeflectionPositionM,
        ).toBeCloseTo(
          2,
          10,
        );

        expect(
          result.curvePoints,
        ).toHaveLength(
          41,
        );
      },
    );

    it(
      "changes deflection but not moment or stress when only E changes",
      () => {
        const base =
          evaluateBendingInteractiveState(
            baseInput,
          );

        const lowerE =
          evaluateBendingInteractiveState(
            {
              ...baseInput,

              elasticModulusGPa:
                100,
            },
          );

        expect(
          lowerE.maximumMomentKNm,
        ).toBeCloseTo(
          base.maximumMomentKNm,
          10,
        );

        expect(
          lowerE.maximumAbsoluteStressMPa,
        ).toBeCloseTo(
          base.maximumAbsoluteStressMPa,
          10,
        );

        expect(
          lowerE.maximumAbsoluteDeflectionMm,
        ).toBeCloseTo(
          2 *
            base.maximumAbsoluteDeflectionMm,
          10,
        );
      },
    );

    it(
      "shows different maximum moment and deflection locations for an eccentric load",
      () => {
        const result =
          evaluateBendingInteractiveState(
            {
              ...baseInput,

              loadPositionM:
                1,
            },
          );

        expect(
          result.maximumMomentKNm,
        ).toBeCloseTo(
          7.5,
          10,
        );

        expect(
          result.maximumMomentPositionM,
        ).toBeCloseTo(
          1,
          10,
        );

        expect(
          result.maximumDeflectionPositionM,
        ).toBeCloseTo(
          1.7639320225,
          8,
        );

        expect(
          result.maximumAbsoluteDeflectionMm,
        ).toBeCloseTo(
          0.698771243,
          8,
        );
      },
    );

    it(
      "captures the stronger influence of section height",
      () => {
        const base =
          evaluateBendingInteractiveState(
            baseInput,
          );

        const doubledHeight =
          evaluateBendingInteractiveState(
            {
              ...baseInput,

              sectionHeightMm:
                400,
            },
          );

        expect(
          doubledHeight.maximumAbsoluteStressMPa,
        ).toBeCloseTo(
          base.maximumAbsoluteStressMPa /
            4,
          10,
        );

        expect(
          doubledHeight.maximumAbsoluteDeflectionMm,
        ).toBeCloseTo(
          base.maximumAbsoluteDeflectionMm /
            8,
          10,
        );
      },
    );
  },
);