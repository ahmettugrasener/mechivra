import {
  createSimplySupportedBeamStateFromDisplayInput,
  fromSI,
} from "@/domain/engineering";

import {
  calculateSimplySupportedPointLoadDeflectionAtX,
  createBeamBendingConfiguration,
  evaluateBeamBending,
} from "@/domain/engineering/beam/bending";

import {
  beamStaticsModel,
} from "@/domain/engineering/beam/statics/model";

import type {
  DeflectionCurvePoint,
} from "@/visualization/bending/deflected-beam-geometry";

export interface BendingWorkedExampleResult {
  readonly maximumMomentKNm:
    number;

  readonly maximumMomentPositionM:
    number;

  readonly secondMomentAreaM4:
    number;

  readonly secondMomentAreaCm4:
    number;

  readonly topStressMPa:
    number;

  readonly bottomStressMPa:
    number;

  readonly maximumStressMPa:
    number;

  readonly maximumDeflectionMm:
    number;

  readonly maximumDeflectionPositionM:
    number;

  readonly stressCriterion:
    "satisfied" |
    "not_satisfied" |
    "undetermined";

  readonly deflectionCriterion:
    "satisfied" |
    "not_satisfied" |
    "undetermined";

  readonly curvePoints:
    readonly DeflectionCurvePoint[];
}

export function createBendingWorkedExampleResult():
  BendingWorkedExampleResult {
  const beamStateResult =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            4,

          unit:
            "m",
        },

        pointLoad: {
          value:
            10,

          unit:
            "kN",
        },

        loadPosition: {
          value:
            2,

          unit:
            "m",
        },
      },
    );

  if (
    !beamStateResult.state
  ) {
    throw new Error(
      "Worked-example beam state is invalid.",
    );
  }

  const beamState =
    beamStateResult.state;

  const configurationResult =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          0.1,

        sectionHeightM:
          0.2,

        elasticModulusPa:
          200e9,

        allowableBendingStressPa:
          20e6,

        allowableDeflectionM:
          0.0005,
      },
    );

  if (
    !configurationResult.configuration
  ) {
    throw new Error(
      "Worked-example bending configuration is invalid.",
    );
  }

  const configuration =
    configurationResult.configuration;

  const staticsResult =
    beamStaticsModel.evaluate(
      beamState,
    );

  if (
    !staticsResult.values
  ) {
    throw new Error(
      "Worked-example Statics result is invalid.",
    );
  }

  const staticsValues =
    staticsResult.values;

  const maximumMomentLocation =
    staticsValues
      .moment
      .maximum
      .location;

  if (
    maximumMomentLocation.type !==
    "point"
  ) {
    throw new Error(
      "Worked example requires a unique maximum-moment location.",
    );
  }

  const result =
    evaluateBeamBending(
      beamState,
      configuration,
    );

  if (
    !result.values
  ) {
    throw new Error(
      "Worked-example Engineering Core result is invalid.",
    );
  }

  const values =
    result.values;

  const maximumDeflectionLocation =
    values
      .deflection
      .maximumLocation;

  if (
    maximumDeflectionLocation.type !==
    "point"
  ) {
    throw new Error(
      "Worked example requires a unique maximum-deflection location.",
    );
  }

  const sampleCount =
    32;

  const curvePoints:
    DeflectionCurvePoint[] =
    Array.from(
      {
        length:
          sampleCount +
          1,
      },

      (
        _,
        index,
      ) => {
        const xM =
          (
            beamState.spanM *
            index
          ) /
          sampleCount;

        return {
          xM,

          deflectionM:
            calculateSimplySupportedPointLoadDeflectionAtX(
              {
                spanM:
                  beamState.spanM,

                pointLoadN:
                  beamState.pointLoadN,

                loadPositionM:
                  beamState.loadPositionM,

                elasticModulusPa:
                  configuration
                    .material
                    .elasticModulusPa,

                secondMomentAreaM4:
                  values
                    .section
                    .secondMomentAreaM4,
              },

              xM,
            ),
        };
      },
    );

  return {
    maximumMomentKNm:
      fromSI(
        "moment",
        values
          .maximumMomentNm,
        "kN_m",
      ),

    maximumMomentPositionM:
      maximumMomentLocation.xM,

    secondMomentAreaM4:
      values
        .section
        .secondMomentAreaM4,

    secondMomentAreaCm4:
      fromSI(
        "second_moment_area",
        values
          .section
          .secondMomentAreaM4,
        "cm4",
      ),

    topStressMPa:
      fromSI(
        "stress",
        values
          .stress
          .topFiberStressPa,
        "MPa",
      ),

    bottomStressMPa:
      fromSI(
        "stress",
        values
          .stress
          .bottomFiberStressPa,
        "MPa",
      ),

    maximumStressMPa:
      fromSI(
        "stress",
        values
          .stress
          .maximumAbsoluteStressPa,
        "MPa",
      ),

    maximumDeflectionMm:
      fromSI(
        "length",
        values
          .deflection
          .maximumAbsoluteDeflectionM,
        "mm",
      ),

    maximumDeflectionPositionM:
      maximumDeflectionLocation.xM,

    stressCriterion:
      values
        .criteria
        .bendingStress
        .status,

    deflectionCriterion:
      values
        .criteria
        .deflection
        .status,

    curvePoints,
  };
}