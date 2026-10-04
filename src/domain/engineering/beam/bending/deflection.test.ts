import {
  describe,
  expect,
  it,
} from "vitest";

import {
  BeamDeflectionCalculationError,
  calculateSimplySupportedPointLoadDeflectionAtX,
  createSimplySupportedPointLoadDeflection,
} from "@/domain/engineering/beam/bending/deflection";

const centeredInput = {
  spanM:
    4,

  pointLoadN:
    10_000,

  loadPositionM:
    2,

  elasticModulusPa:
    200e9,

  secondMomentAreaM4:
    0.00006666666666666668,
} as const;

describe(
  "Simply supported beam point-load deflection",
  () => {
    it(
      "returns zero deflection at both simple supports",
      () => {
        expect(
          calculateSimplySupportedPointLoadDeflectionAtX(
            centeredInput,
            0,
          ),
        ).toBe(0);

        expect(
          calculateSimplySupportedPointLoadDeflectionAtX(
            centeredInput,
            4,
          ),
        ).toBe(0);
      },
    );

    it(
      "reproduces PL^3 over 48EI for a centered point load",
      () => {
        const expectedMagnitudeM =
          (
            centeredInput.pointLoadN *
            centeredInput.spanM ** 3
          ) /
          (
            48 *
            centeredInput.elasticModulusPa *
            centeredInput.secondMomentAreaM4
          );

        const result =
          createSimplySupportedPointLoadDeflection(
            centeredInput,
          );

        expect(
          expectedMagnitudeM,
        ).toBeCloseTo(
          0.001,
          12,
        );

        expect(
          result.maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          expectedMagnitudeM,
          12,
        );

        expect(
          result.signedDeflectionAtMaximumM,
        ).toBeCloseTo(
          -0.001,
          12,
        );

        expect(
          result.maximumLocation,
        ).toEqual({
          type:
            "point",

          xM:
            2,
        });
      },
    );

    it(
      "is continuous at the point-load position",
      () => {
        const a =
          centeredInput.loadPositionM;

        const atLoad =
          calculateSimplySupportedPointLoadDeflectionAtX(
            centeredInput,
            a,
          );

        const result =
          createSimplySupportedPointLoadDeflection(
            centeredInput,
          );

        expect(
          atLoad,
        ).toBeCloseTo(
          result.signedDeflectionAtMaximumM,
          12,
        );
      },
    );

    it(
      "finds the maximum away from the load point for an asymmetric load",
      () => {
        const input = {
          ...centeredInput,

          loadPositionM:
            1,
        };

        const result =
          createSimplySupportedPointLoadDeflection(
            input,
          );

        if (
          result.maximumLocation.type !==
          "point"
        ) {
          throw new Error(
            "Expected a unique maximum-deflection point.",
          );
        }

        expect(
          result.maximumLocation.xM,
        ).toBeCloseTo(
          1.7639320225002102,
          10,
        );

        expect(
          result.maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          0.0006987712429686842,
          12,
        );

        expect(
          result.maximumLocation.xM,
        ).not.toBe(
          input.loadPositionM,
        );
      },
    );

    it(
      "mirrors maximum deflection when the load position is mirrored",
      () => {
        const left =
          createSimplySupportedPointLoadDeflection(
            {
              ...centeredInput,

              loadPositionM:
                1,
            },
          );

        const right =
          createSimplySupportedPointLoadDeflection(
            {
              ...centeredInput,

              loadPositionM:
                3,
            },
          );

        if (
          left.maximumLocation.type !==
            "point" ||
          right.maximumLocation.type !==
            "point"
        ) {
          throw new Error(
            "Expected unique maximum-deflection locations.",
          );
        }

        expect(
          right.maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          left.maximumAbsoluteDeflectionM,
          12,
        );

        expect(
          right.maximumLocation.xM,
        ).toBeCloseTo(
          centeredInput.spanM -
            left.maximumLocation.xM,
          12,
        );
      },
    );

    it(
      "scales inversely with elastic modulus",
      () => {
        const base =
          createSimplySupportedPointLoadDeflection(
            centeredInput,
          );

        const halfElasticModulus =
          createSimplySupportedPointLoadDeflection(
            {
              ...centeredInput,

              elasticModulusPa:
                centeredInput.elasticModulusPa /
                2,
            },
          );

        expect(
          halfElasticModulus.maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          2 *
            base.maximumAbsoluteDeflectionM,
          12,
        );
      },
    );

    it(
      "represents zero-load maximum deflection as the full-span interval",
      () => {
        const result =
          createSimplySupportedPointLoadDeflection(
            {
              ...centeredInput,

              pointLoadN:
                0,
            },
          );

        expect(
          result.maximumAbsoluteDeflectionM,
        ).toBe(0);

        expect(
          result.signedDeflectionAtMaximumM,
        ).toBe(0);

        expect(
          result.maximumLocation,
        ).toEqual({
          type:
            "interval",

          startM:
            0,

          endM:
            4,
        });
      },
    );

    it(
      "rejects invalid geometry, stiffness, load position, and evaluation position",
      () => {
        expect(
          () =>
            createSimplySupportedPointLoadDeflection(
              {
                ...centeredInput,

                spanM:
                  0,
              },
            ),
        ).toThrow(
          BeamDeflectionCalculationError,
        );

        expect(
          () =>
            createSimplySupportedPointLoadDeflection(
              {
                ...centeredInput,

                elasticModulusPa:
                  0,
              },
            ),
        ).toThrow(
          BeamDeflectionCalculationError,
        );

        expect(
          () =>
            createSimplySupportedPointLoadDeflection(
              {
                ...centeredInput,

                loadPositionM:
                  4,
              },
            ),
        ).toThrow(
          BeamDeflectionCalculationError,
        );

        expect(
          () =>
            calculateSimplySupportedPointLoadDeflectionAtX(
              centeredInput,
              5,
            ),
        ).toThrow(
          BeamDeflectionCalculationError,
        );
      },
    );
  },
);