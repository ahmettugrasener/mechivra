import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createBeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

import {
  evaluateBeamBendingStress,
} from "@/domain/engineering/beam/bending/model";

import {
  createSimplySupportedBeamStateFromDisplayInput,
} from "@/domain/engineering/beam/input";

import {
  beamStaticsModel,
} from "@/domain/engineering/beam/statics/model";

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
      "Expected a valid beam state.",
    );
  }

  return result.state;
}

function createConfiguration(
  elasticModulusPa =
    200e9,

  widthM =
    0.1,

  heightM =
    0.2,
) {
  const result =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          widthM,

        sectionHeightM:
          heightM,

        elasticModulusPa,
      },
    );

  if (
    !result.configuration
  ) {
    throw new Error(
      "Expected a valid bending configuration.",
    );
  }

  return result.configuration;
}

describe(
  "Beam bending stress model",
  () => {
    it(
      "uses the centered-load moment produced by the Statics Engineering Core",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            2,
          );

        const statics =
          beamStaticsModel.evaluate(
            beamState,
          );

        const bending =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(),
          );

        if (
          !statics.values ||
          !bending.values
        ) {
          throw new Error(
            "Expected valid engineering results.",
          );
        }

        expect(
          statics.values
            .moment.maximum
            .valueNm,
        ).toBeCloseTo(
          10_000,
          8,
        );

        expect(
          bending.values
            .maximumMomentNm,
        ).toBe(
          statics.values
            .moment.maximum
            .valueNm,
        );

        expect(
          bending.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          15_000_000,
          6,
        );
      },
    );

    it(
      "uses the asymmetric-load moment without duplicating Statics equations",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            1,
          );

        const statics =
          beamStaticsModel.evaluate(
            beamState,
          );

        const bending =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(),
          );

        if (
          !statics.values ||
          !bending.values
        ) {
          throw new Error(
            "Expected valid engineering results.",
          );
        }

        expect(
          statics.values
            .moment.maximum
            .valueNm,
        ).toBeCloseTo(
          7_500,
          8,
        );

        expect(
          bending.values
            .maximumMomentNm,
        ).toBe(
          statics.values
            .moment.maximum
            .valueNm,
        );

        expect(
          bending.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          11_250_000,
          6,
        );
      },
    );

    it(
      "keeps bending stress unchanged when only elastic modulus changes",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            2,
          );

        const steelLike =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(
              200e9,
            ),
          );

        const aluminumLike =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(
              70e9,
            ),
          );

        if (
          !steelLike.values ||
          !aluminumLike.values
        ) {
          throw new Error(
            "Expected valid engineering results.",
          );
        }

        expect(
          aluminumLike.values
            .maximumMomentNm,
        ).toBe(
          steelLike.values
            .maximumMomentNm,
        );

        expect(
          aluminumLike.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          steelLike.values
            .stress
            .maximumAbsoluteStressPa,
          8,
        );
      },
    );

    it(
      "halves maximum stress when section width doubles",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            2,
          );

        const base =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(
              200e9,
              0.1,
              0.2,
            ),
          );

        const wider =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(
              200e9,
              0.2,
              0.2,
            ),
          );

        if (
          !base.values ||
          !wider.values
        ) {
          throw new Error(
            "Expected valid engineering results.",
          );
        }

        expect(
          wider.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          base.values
            .stress
            .maximumAbsoluteStressPa /
            2,
          8,
        );
      },
    );

    it(
      "reduces maximum stress by a factor of four when section height doubles",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            2,
          );

        const base =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(
              200e9,
              0.1,
              0.2,
            ),
          );

        const deeper =
          evaluateBeamBendingStress(
            beamState,
            createConfiguration(
              200e9,
              0.1,
              0.4,
            ),
          );

        if (
          !base.values ||
          !deeper.values
        ) {
          throw new Error(
            "Expected valid engineering results.",
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
      },
    );

    it(
      "scales stress linearly with point-load magnitude",
      () => {
        const tenKN =
          evaluateBeamBendingStress(
            createBeamState(
              4,
              10,
              2,
            ),

            createConfiguration(),
          );

        const twentyKN =
          evaluateBeamBendingStress(
            createBeamState(
              4,
              20,
              2,
            ),

            createConfiguration(),
          );

        if (
          !tenKN.values ||
          !twentyKN.values
        ) {
          throw new Error(
            "Expected valid engineering results.",
          );
        }

        expect(
          twentyKN.values
            .maximumMomentNm,
        ).toBeCloseTo(
          2 *
            tenKN.values
              .maximumMomentNm,
          8,
        );

        expect(
          twentyKN.values
            .stress
            .maximumAbsoluteStressPa,
        ).toBeCloseTo(
          2 *
            tenKN.values
              .stress
              .maximumAbsoluteStressPa,
          8,
        );
      },
    );

    it(
      "supports the zero-load state without producing negative zero",
      () => {
        const bending =
          evaluateBeamBendingStress(
            createBeamState(
              4,
              0,
              2,
            ),

            createConfiguration(),
          );

        if (
          !bending.values
        ) {
          throw new Error(
            "Expected valid zero-load result.",
          );
        }

        expect(
          bending.values
            .maximumMomentNm,
        ).toBe(0);

        expect(
          bending.values
            .stress
            .topFiberStressPa,
        ).toBe(0);

        expect(
          bending.values
            .stress
            .bottomFiberStressPa,
        ).toBe(0);

        expect(
          Object.is(
            bending.values
              .stress
              .topFiberStressPa,
            -0,
          ),
        ).toBe(false);
      },
    );

    it(
      "returns invalid when the bending configuration is forged with invalid geometry",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            2,
          );

        const configuration =
          createConfiguration();

        const invalid =
          evaluateBeamBendingStress(
            beamState,
            {
              ...configuration,

              section: {
                ...configuration.section,

                widthM:
                  0,
              },
            },
          );

        expect(
          invalid.status,
        ).toBe(
          "invalid",
        );

        expect(
          invalid.values,
        ).toBeNull();

        expect(
          invalid.issues,
        ).toHaveLength(1);
      },
    );

    it(
      "is deterministic for identical physical inputs",
      () => {
        const beamState =
          createBeamState(
            4,
            10,
            1.5,
          );

        const configuration =
          createConfiguration(
            200e9,
            0.12,
            0.24,
          );

        const first =
          evaluateBeamBendingStress(
            beamState,
            configuration,
          );

        const second =
          evaluateBeamBendingStress(
            beamState,
            configuration,
          );

        expect(
          first,
        ).toEqual(
          second,
        );
      },
    );
  },
);