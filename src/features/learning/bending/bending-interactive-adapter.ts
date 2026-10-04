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

export interface BendingInteractiveInput {
  readonly spanM:
    number;

  readonly pointLoadKN:
    number;

  readonly loadPositionM:
    number;

  readonly sectionWidthMm:
    number;

  readonly sectionHeightMm:
    number;

  readonly elasticModulusGPa:
    number;
}

export interface BendingInteractiveOutput {
  readonly maximumMomentKNm:
    number;

  readonly maximumMomentPositionM:
    number;

  readonly secondMomentAreaCm4:
    number;

  readonly topStressMPa:
    number;

  readonly bottomStressMPa:
    number;

  readonly maximumAbsoluteStressMPa:
    number;

  readonly maximumAbsoluteDeflectionMm:
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

export class BendingInteractiveAdapterError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "BendingInteractiveAdapterError";
  }
}

export function evaluateBendingInteractiveState(
  input:
    BendingInteractiveInput,
): BendingInteractiveOutput {
  const beamStateResult =
    createSimplySupportedBeamStateFromDisplayInput(
      {
        span: {
          value:
            input.spanM,

          unit:
            "m",
        },

        pointLoad: {
          value:
            input.pointLoadKN,

          unit:
            "kN",
        },

        loadPosition: {
          value:
            input.loadPositionM,

          unit:
            "m",
        },
      },
    );

  if (
    !beamStateResult.state
  ) {
    throw new BendingInteractiveAdapterError(
      "Interactive beam state is invalid.",
    );
  }

  const beamState =
    beamStateResult.state;

  const configurationResult =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          input.sectionWidthMm /
          1000,

        sectionHeightM:
          input.sectionHeightMm /
          1000,

        elasticModulusPa:
          input.elasticModulusGPa *
          1e9,

        allowableBendingStressPa:
          20e6,

        allowableDeflectionM:
          0.002,
      },
    );

  if (
    !configurationResult.configuration
  ) {
    throw new BendingInteractiveAdapterError(
      "Interactive bending configuration is invalid.",
    );
  }

  const configuration =
    configurationResult.configuration;

  const result =
    evaluateBeamBending(
      beamState,
      configuration,
    );

  if (
    !result.values
  ) {
    throw new BendingInteractiveAdapterError(
      "Bending Engineering Core did not produce values.",
    );
  }

  const values =
    result.values;

  const staticsResult =
    beamStaticsModel.evaluate(
      beamState,
    );

  if (
    !staticsResult.values
  ) {
    throw new BendingInteractiveAdapterError(
      "Statics Engineering Core did not produce values.",
    );
  }

  const staticsValues =
    staticsResult.values;

  const maximumMomentLocation =
    staticsValues
      .moment.maximum
      .location;

  if (
    maximumMomentLocation.type !==
    "point"
  ) {
    throw new BendingInteractiveAdapterError(
      "Interactive positive-load case requires a unique maximum-moment location.",
    );
  }

  const maximumDeflectionLocation =
    values
      .deflection
      .maximumLocation;

  if (
    maximumDeflectionLocation.type !==
    "point"
  ) {
    throw new BendingInteractiveAdapterError(
      "Interactive positive-load case requires a unique maximum-deflection location.",
    );
  }

  const sampleCount =
    40;

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
            input.spanM *
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

    maximumAbsoluteStressMPa:
      fromSI(
        "stress",
        values
          .stress
          .maximumAbsoluteStressPa,
        "MPa",
      ),

    maximumAbsoluteDeflectionMm:
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