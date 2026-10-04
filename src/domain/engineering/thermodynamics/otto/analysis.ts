import {
  calculateIdealOttoEnergyPerformance,
} from "@/domain/engineering/thermodynamics/otto/energy";

import type {
  IdealOttoEnergyPerformance,
} from "@/domain/engineering/thermodynamics/otto/energy";

import {
  evaluateIdealOttoFourStateCycle,
} from "@/domain/engineering/thermodynamics/otto/model";

import type {
  IdealOttoFourStateValues,
} from "@/domain/engineering/thermodynamics/otto/model";

import type {
  IdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

export const IDEAL_OTTO_ANALYSIS_MODEL_ID =
  "ideal-otto-constant-specific-heat";

export const IDEAL_OTTO_ANALYSIS_MODEL_VERSION =
  "1.0.0";

export type IdealOttoAnalysisExecutionStatus =
  | "valid"
  | "invalid";

export interface IdealOttoAnalysisValues
  extends IdealOttoFourStateValues {
  readonly energy:
    IdealOttoEnergyPerformance;
}

export interface IdealOttoAnalysisEvaluation {
  readonly modelId:
    typeof IDEAL_OTTO_ANALYSIS_MODEL_ID;

  readonly modelVersion:
    typeof IDEAL_OTTO_ANALYSIS_MODEL_VERSION;

  readonly status:
    IdealOttoAnalysisExecutionStatus;

  readonly values:
    IdealOttoAnalysisValues | null;

  readonly assumptions:
    readonly string[];

  readonly warnings:
    readonly string[];

  readonly issues:
    readonly string[];
}

function createInvalidResult(
  issues:
    readonly string[],

  assumptions:
    readonly string[],

  warnings:
    readonly string[],
): IdealOttoAnalysisEvaluation {
  return {
    modelId:
      IDEAL_OTTO_ANALYSIS_MODEL_ID,

    modelVersion:
      IDEAL_OTTO_ANALYSIS_MODEL_VERSION,

    status:
      "invalid",

    values:
      null,

    assumptions,

    warnings,

    issues,
  };
}

export function evaluateIdealOttoCycle(
  inputState:
    IdealOttoInputState,
): IdealOttoAnalysisEvaluation {
  const fourStateResult =
    evaluateIdealOttoFourStateCycle(
      inputState,
    );

  if (
    !fourStateResult.values
  ) {
    return createInvalidResult(
      fourStateResult.issues,
      fourStateResult.assumptions,
      fourStateResult.warnings,
    );
  }

  const fourStateValues =
    fourStateResult.values;

  try {
    const energy =
      calculateIdealOttoEnergyPerformance(
        {
          state1:
            fourStateValues
              .states
              .state1,

          state4:
            fourStateValues
              .states
              .state4,

          heatInputJPerKg:
            inputState
              .heatInputJPerKg,

          compressionRatio:
            inputState
              .compressionRatio,

          gasProperties:
            fourStateValues
              .gasProperties,
        },
      );

    return {
      modelId:
        IDEAL_OTTO_ANALYSIS_MODEL_ID,

      modelVersion:
        IDEAL_OTTO_ANALYSIS_MODEL_VERSION,

      status:
        "valid",

      values: {
        ...fourStateValues,

        energy,
      },

      assumptions:
        fourStateResult
          .assumptions,

      /*
       * No expert-approved maximum-temperature validity
       * threshold has been encoded yet.
       */
      warnings:
        fourStateResult
          .warnings,

      issues: [],
    };
  } catch (
    error
  ) {
    return createInvalidResult(
      [
        error instanceof
        Error
          ? error.message
          : "Ideal Otto energy evaluation failed.",
      ],
      fourStateResult.assumptions,
      fourStateResult.warnings,
    );
  }
}

export const idealOttoAnalysisModel = {
  id:
    IDEAL_OTTO_ANALYSIS_MODEL_ID,

  version:
    IDEAL_OTTO_ANALYSIS_MODEL_VERSION,

  evaluate:
    evaluateIdealOttoCycle,
} as const;