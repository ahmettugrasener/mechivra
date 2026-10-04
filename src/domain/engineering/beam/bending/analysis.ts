import {
  evaluateBeamBendingCriteria,
} from "@/domain/engineering/beam/bending/criteria";

import type {
  BeamBendingCriteriaEvaluation,
} from "@/domain/engineering/beam/bending/criteria";

import {
  createSimplySupportedPointLoadDeflection,
} from "@/domain/engineering/beam/bending/deflection";

import type {
  SimplySupportedPointLoadDeflectionResult,
} from "@/domain/engineering/beam/bending/deflection";

import {
  evaluateBeamBendingStress,
} from "@/domain/engineering/beam/bending/model";

import type {
  BeamStaticsStateForBending,
} from "@/domain/engineering/beam/bending/model";

import type {
  RectangularSectionProperties,
} from "@/domain/engineering/beam/bending/section";

import type {
  BeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

import type {
  RectangularBendingStressDistribution,
} from "@/domain/engineering/beam/bending/stress";

export const BEAM_BENDING_MODEL_ID =
  "beam-bending-rectangular-linear-elastic";

export const BEAM_BENDING_MODEL_VERSION =
  "1.0.0";

export type BeamBendingExecutionStatus =
  | "valid"
  | "invalid";

export interface BeamBendingAnalysisValues {
  readonly maximumMomentNm:
    number;

  readonly section:
    RectangularSectionProperties;

  readonly stress:
    RectangularBendingStressDistribution;

  readonly deflection:
    SimplySupportedPointLoadDeflectionResult;

  readonly criteria:
    BeamBendingCriteriaEvaluation;
}

export interface BeamBendingAnalysisResult {
  readonly modelId:
    typeof BEAM_BENDING_MODEL_ID;

  readonly modelVersion:
    typeof BEAM_BENDING_MODEL_VERSION;

  readonly status:
    BeamBendingExecutionStatus;

  readonly values:
    BeamBendingAnalysisValues | null;

  readonly assumptions:
    readonly string[];

  readonly warnings:
    readonly string[];

  readonly issues:
    readonly string[];
}

const DEFLECTION_ASSUMPTIONS =
  [
    "The beam is modeled with elementary Euler-Bernoulli bending behavior.",

    "Deflections are small relative to the beam dimensions.",

    "Elastic modulus and cross-section are constant along the beam.",

    "The point load acts vertically downward between the two simple supports.",

    "Positive vertical displacement is upward, so downward beam deflection is reported with a negative sign.",

    "The off-center point-load deflection is evaluated with the general piecewise simply supported beam solution; the centered-load PL^3/(48EI) expression is treated only as its special case.",
  ] as const;

function createInvalidResult(
  issues:
    readonly string[],

  assumptions:
    readonly string[],
): BeamBendingAnalysisResult {
  return {
    modelId:
      BEAM_BENDING_MODEL_ID,

    modelVersion:
      BEAM_BENDING_MODEL_VERSION,

    status:
      "invalid",

    values:
      null,

    assumptions,

    warnings: [],

    issues,
  };
}

export function evaluateBeamBending(
  beamState:
    BeamStaticsStateForBending,

  configuration:
    BeamBendingConfiguration,
): BeamBendingAnalysisResult {
  const stressResult =
    evaluateBeamBendingStress(
      beamState,
      configuration,
    );

  const assumptions = [
    ...stressResult.assumptions,
    ...DEFLECTION_ASSUMPTIONS,
  ];

  if (
    !stressResult.values
  ) {
    return createInvalidResult(
      stressResult.issues,
      assumptions,
    );
  }

  const deflection =
    createSimplySupportedPointLoadDeflection(
      {
        spanM:
          beamState.spanM,

        pointLoadN:
          beamState.pointLoadN,

        loadPositionM:
          beamState.loadPositionM,

        elasticModulusPa:
          configuration.material
            .elasticModulusPa,

        secondMomentAreaM4:
          stressResult.values
            .section
            .secondMomentAreaM4,
      },
    );

  const criteria =
    evaluateBeamBendingCriteria(
      stressResult.values
        .stress
        .maximumAbsoluteStressPa,

      deflection
        .maximumAbsoluteDeflectionM,

      configuration,
    );

  return {
    modelId:
      BEAM_BENDING_MODEL_ID,

    modelVersion:
      BEAM_BENDING_MODEL_VERSION,

    status:
      "valid",

    values: {
      maximumMomentNm:
        stressResult.values
          .maximumMomentNm,

      section:
        stressResult.values
          .section,

      stress:
        stressResult.values
          .stress,

      deflection,

      criteria,
    },

    assumptions,

    warnings: [],

    issues: [],
  };
}

export const beamBendingModel = {
  id:
    BEAM_BENDING_MODEL_ID,

  version:
    BEAM_BENDING_MODEL_VERSION,

  evaluate:
    evaluateBeamBending,
} as const;