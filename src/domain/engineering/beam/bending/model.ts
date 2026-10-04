import {
  createRectangularSectionProperties,
} from "@/domain/engineering/beam/bending/section";

import type {
  RectangularSectionProperties,
} from "@/domain/engineering/beam/bending/section";

import {
  createBeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

import type {
  BeamBendingConfiguration,
} from "@/domain/engineering/beam/bending/state";

import {
  createRectangularBendingStressDistribution,
} from "@/domain/engineering/beam/bending/stress";

import type {
  RectangularBendingStressDistribution,
} from "@/domain/engineering/beam/bending/stress";

import {
  beamStaticsModel,
} from "@/domain/engineering/beam/statics/model";

export const BEAM_BENDING_STRESS_MODEL_ID =
  "beam-bending-rectangular-linear-elastic-stress";

export const BEAM_BENDING_STRESS_MODEL_VERSION =
  "1.0.0";

export type BendingStressExecutionStatus =
  | "valid"
  | "invalid";

export type BeamStaticsStateForBending =
  Parameters<
    typeof beamStaticsModel.evaluate
  >[0];

export interface BeamBendingStressValues {
  readonly maximumMomentNm:
    number;

  readonly section:
    RectangularSectionProperties;

  readonly stress:
    RectangularBendingStressDistribution;
}

export interface BeamBendingStressEvaluation {
  readonly modelId:
    typeof BEAM_BENDING_STRESS_MODEL_ID;

  readonly modelVersion:
    typeof BEAM_BENDING_STRESS_MODEL_VERSION;

  readonly status:
    BendingStressExecutionStatus;

  readonly values:
    BeamBendingStressValues | null;

  readonly assumptions:
    readonly string[];

  readonly warnings:
    readonly string[];

  readonly issues:
    readonly string[];
}

const BENDING_STRESS_ASSUMPTIONS =
  [
    "The beam is homogeneous and prismatic.",

    "The cross-section is rectangular and constant along the beam.",

    "The material response is linear elastic.",

    "Plane sections are represented by the elementary beam-bending stress relation.",

    "The normal-stress sign convention is sigma_x = -M y / I.",

    "Positive y is upward from the neutral axis.",

    "Positive normal stress denotes tension and negative normal stress denotes compression.",

    "The bending moment is obtained from the existing beam Statics Engineering Core and is not recalculated by the bending model.",
  ] as const;

function validateConfiguration(
  configuration:
    BeamBendingConfiguration,
):
  | BeamBendingConfiguration
  | null {
  const result =
    createBeamBendingConfiguration(
      {
        sectionWidthM:
          configuration.section
            .widthM,

        sectionHeightM:
          configuration.section
            .heightM,

        elasticModulusPa:
          configuration.material
            .elasticModulusPa,

        allowableBendingStressPa:
          configuration.material
            .allowableBendingStressPa,

        allowableDeflectionM:
          configuration.criteria
            .allowableDeflectionM,
      },
    );

  return result.configuration;
}

function createInvalidResult(
  issue: string,
): BeamBendingStressEvaluation {
  return {
    modelId:
      BEAM_BENDING_STRESS_MODEL_ID,

    modelVersion:
      BEAM_BENDING_STRESS_MODEL_VERSION,

    status:
      "invalid",

    values:
      null,

    assumptions:
      BENDING_STRESS_ASSUMPTIONS,

    warnings: [],

    issues: [
      issue,
    ],
  };
}

export function evaluateBeamBendingStress(
  beamState:
    BeamStaticsStateForBending,

  configuration:
    BeamBendingConfiguration,
): BeamBendingStressEvaluation {
  const validatedConfiguration =
    validateConfiguration(
      configuration,
    );

  if (
    !validatedConfiguration
  ) {
    return createInvalidResult(
      "Bending configuration is invalid.",
    );
  }

  const staticsResult =
    beamStaticsModel.evaluate(
      beamState,
    );

  if (
    !staticsResult.values
  ) {
    return createInvalidResult(
      "Beam Statics Engineering Core did not produce a valid result.",
    );
  }

  const section =
    createRectangularSectionProperties(
      validatedConfiguration
        .section,
    );

  const maximumMomentNm =
    staticsResult.values
      .moment.maximum
      .valueNm;

  const stress =
    createRectangularBendingStressDistribution(
      maximumMomentNm,
      section,
    );

  return {
    modelId:
      BEAM_BENDING_STRESS_MODEL_ID,

    modelVersion:
      BEAM_BENDING_STRESS_MODEL_VERSION,

    status:
      "valid",

    values: {
      maximumMomentNm,

      section,

      stress,
    },

    assumptions:
      BENDING_STRESS_ASSUMPTIONS,

    warnings: [],

    issues: [],
  };
}

export const beamBendingStressModel = {
  id:
    BEAM_BENDING_STRESS_MODEL_ID,

  version:
    BEAM_BENDING_STRESS_MODEL_VERSION,

  evaluate:
    evaluateBeamBendingStress,
} as const;