import {
  describe,
  expect,
  it,
} from "vitest";

import {
  evaluateBeamBending,
} from "@/domain/engineering/beam/bending/analysis";

import {
  createBeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

import {
  createSimplySupportedBeamStateFromDisplayInput,
} from "@/domain/engineering/beam/input";

function createBeamState(
  spanM:
    number,

  pointLoadKN:
    number,

  loadPositionM:
    number,
) {
  const result =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            spanM,

          unit:
            "m",
        },

        pointLoad: {
          value:
            pointLoadKN,

          unit:
            "kN",
        },

        loadPosition: {
          value:
            loadPositionM,

          unit:
            "m",
        },
      },
    );

  if (
    !result.state
  ) {
    throw new Error(
      "Expected valid beam state.",
    );
  }

  return result.state;
}

function createConfiguration({
  elasticModulusPa =
    200e9,

  widthM =
    0.1,

  heightM =
    0.2,

  allowableBendingStressPa =
    null as number | null,

  allowableDeflectionM =
    null as number | null,
} = {}) {
  const result =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          widthM,

        sectionHeightM:
          heightM,

        elasticModulusPa,

        allowableBendingStressPa,

        allowableDeflectionM,
      },
    );

  if (
    !result.configuration
  ) {
    throw new Error(
      "Expected valid bending configuration.",
    );
  }

  return result.configuration;
}

describe(
  "Complete beam bending analysis",
  () => {
    it(
      "combines verified Statics moment, stress, and centered-load deflection",
      () => {
        const result =
          evaluateBeamBending(
            createBeamState(
              4,
              10,
              2,
            ),

            createConfiguration(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid bending analysis.",
          );
        }

        expect(
          result.values
            .maximumMomentNm,
        ).toBeCloseTo(
          10_000,
          8,
        );

        expect(
          result.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          15_000_000,
          6,
        );

        expect(
          result.values
            .deflection
            .maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          0.001,
          12,
        );

        expect(
          result.values
            .deflection
            .maximumLocation,
        ).toEqual({
          type:
            "point",

          xM:
            2,
        });
      },
    );

    it(
      "changes deflection but not moment or stress when E changes",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            2,
          );

        const base =
          evaluateBeamBending(
            beamState,

            createConfiguration({
              elasticModulusPa:
                200e9,
            }),
          );

        const lowerE =
          evaluateBeamBending(
            beamState,

            createConfiguration({
              elasticModulusPa:
                100e9,
            }),
          );

        if (
          !base.values ||
          !lowerE.values
        ) {
          throw new Error(
            "Expected valid bending analyses.",
          );
        }

        expect(
          lowerE.values
            .maximumMomentNm,
        ).toBe(
          base.values
            .maximumMomentNm,
        );

        expect(
          lowerE.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          base.values
            .stress
            .maximumAbsoluteStressPa,
          8,
        );

        expect(
          lowerE.values
            .deflection
            .maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          2 *
            base.values
              .deflection
              .maximumAbsoluteDeflectionM,
          12,
        );
      },
    );

    it(
      "reduces stress by four and deflection by eight when section height doubles",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            2,
          );

        const base =
          evaluateBeamBending(
            beamState,

            createConfiguration({
              heightM:
                0.2,
            }),
          );

        const deeper =
          evaluateBeamBending(
            beamState,

            createConfiguration({
              heightM:
                0.4,
            }),
          );

        if (
          !base.values ||
          !deeper.values
        ) {
          throw new Error(
            "Expected valid bending analyses.",
          );
        }

        expect(
          deeper.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          base.values
            .stress
            .maximumAbsoluteStressPa /
            4,
          8,
        );

        expect(
          deeper.values
            .deflection
            .maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          base.values
            .deflection
            .maximumAbsoluteDeflectionM /
            8,
          12,
        );
      },
    );

    it(
      "evaluates stress and deflection criteria independently",
      () => {
        const result =
          evaluateBeamBending(
            createBeamState(
              4,
              10,
              2,
            ),

            createConfiguration({
              allowableBendingStressPa:
                20e6,

              allowableDeflectionM:
                0.0005,
            }),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid bending analysis.",
          );
        }

        expect(
          result.values
            .criteria
            .bendingStress
            .status,
        ).toBe(
          "satisfied",
        );

        expect(
          result.values
            .criteria
            .deflection
            .status,
        ).toBe(
          "not_satisfied",
        );
      },
    );

    it(
      "returns undetermined criteria rather than assuming missing limits",
      () => {
        const result =
          evaluateBeamBending(
            createBeamState(
              4,
              10,
              2,
            ),

            createConfiguration(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid bending analysis.",
          );
        }

        expect(
          result.values
            .criteria
            .bendingStress
            .status,
        ).toBe(
          "undetermined",
        );

        expect(
          result.values
            .criteria
            .deflection
            .status,
        ).toBe(
          "undetermined",
        );
      },
    );

    it(
      "uses the general deflection solution for an off-center point load",
      () => {
        const result =
          evaluateBeamBending(
            createBeamState(
              4,
              10,
              1,
            ),

            createConfiguration(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid bending analysis.",
          );
        }

        expect(
          result.values
            .maximumMomentNm,
        ).toBeCloseTo(
          7_500,
          8,
        );

        expect(
          result.values
            .deflection
            .maximumAbsoluteDeflectionM,
        ).toBeCloseTo(
          0.0006987712429686842,
          12,
        );

        const location =
          result.values
            .deflection
            .maximumLocation;

        if (
          location.type !==
          "point"
        ) {
          throw new Error(
            "Expected unique maximum-deflection location.",
          );
        }

        expect(
          location.xM,
        ).toBeCloseTo(
          1.7639320225002102,
          10,
        );

        expect(
          location.xM,
        ).not.toBe(1);
      },
    );

    it(
      "remains valid at zero load and reports zero stress and deflection",
      () => {
        const result =
          evaluateBeamBending(
            createBeamState(
              4,
              0,
              2,
            ),

            createConfiguration(),
          );

        if (
          !result.values
        ) {
          throw new Error(
            "Expected valid zero-load analysis.",
          );
        }

        expect(
          result.values
            .maximumMomentNm,
        ).toBe(0);

        expect(
          result.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBe(0);

        expect(
          result.values
            .deflection
            .maximumAbsoluteDeflectionM,
        ).toBe(0);

        expect(
          result.values
            .deflection
            .maximumLocation,
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
  },
);