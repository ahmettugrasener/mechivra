import {
  IDEAL_OTTO_REFERENCE_AIR_PROPERTIES,
  IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

import type {
  ConstantSpecificHeatIdealGasPropertySet,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

import {
  IDEAL_OTTO_PROCESS_SEQUENCE,
} from "@/domain/engineering/thermodynamics/otto/processes";

import type {
  IdealOttoProcessDefinition,
} from "@/domain/engineering/thermodynamics/otto/processes";

import {
  calculateIdealOttoState2,
  calculateIdealOttoState3,
  calculateIdealOttoState4,
  createIdealOttoState1,
} from "@/domain/engineering/thermodynamics/otto/relations";

import {
  createIdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

import type {
  IdealOttoInputState,
} from "@/domain/engineering/thermodynamics/otto/state";

import type {
  IdealOttoThermodynamicStatePoint,
} from "@/domain/engineering/thermodynamics/otto/state-point";

export const IDEAL_OTTO_FOUR_STATE_MODEL_ID =
  "ideal-otto-constant-specific-heat-four-state";

export const IDEAL_OTTO_FOUR_STATE_MODEL_VERSION =
  "1.0.0";

export type IdealOttoFourStateExecutionStatus =
  | "valid"
  | "invalid";

export interface IdealOttoFourStateValues {
  readonly gasProperties:
    ConstantSpecificHeatIdealGasPropertySet;

  readonly states: {
    readonly state1:
      IdealOttoThermodynamicStatePoint;

    readonly state2:
      IdealOttoThermodynamicStatePoint;

    readonly state3:
      IdealOttoThermodynamicStatePoint;

    readonly state4:
      IdealOttoThermodynamicStatePoint;
  };

  readonly processes:
    readonly IdealOttoProcessDefinition[];
}

export interface IdealOttoFourStateEvaluation {
  readonly modelId:
    typeof IDEAL_OTTO_FOUR_STATE_MODEL_ID;

  readonly modelVersion:
    typeof IDEAL_OTTO_FOUR_STATE_MODEL_VERSION;

  readonly status:
    IdealOttoFourStateExecutionStatus;

  readonly values:
    IdealOttoFourStateValues | null;

  readonly assumptions:
    readonly string[];

  readonly warnings:
    readonly string[];

  readonly issues:
    readonly string[];
}

const IDEAL_OTTO_ASSUMPTIONS =
  [
    "The cycle is an ideal air-standard Otto cycle.",

    "The working fluid is modeled as an ideal gas.",

    "Specific heats are constant within the model.",

    "The working mass is fixed within the closed ideal cycle.",

    "Process 1 to 2 is isentropic compression.",

    "Process 2 to 3 is constant-volume heat addition.",

    "Process 3 to 4 is isentropic expansion.",

    "Process 4 to 1 is constant-volume heat rejection.",

    "Real combustion chemistry, gas exchange, friction, knock, and real-engine performance are not modeled.",
  ] as const;

function createInvalidResult(
  issue:
    string,
): IdealOttoFourStateEvaluation {
  return {
    modelId:
      IDEAL_OTTO_FOUR_STATE_MODEL_ID,

    modelVersion:
      IDEAL_OTTO_FOUR_STATE_MODEL_VERSION,

    status:
      "invalid",

    values:
      null,

    assumptions:
      IDEAL_OTTO_ASSUMPTIONS,

    warnings: [],

    issues: [
      issue,
    ],
  };
}

function resolveGasProperties(
  gasPropertySetId:
    string,
):
  | ConstantSpecificHeatIdealGasPropertySet
  | null {
  if (
    gasPropertySetId ===
    IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID
  ) {
    return IDEAL_OTTO_REFERENCE_AIR_PROPERTIES;
  }

  return null;
}

function allStateValuesAreFinitePositive(
  state:
    IdealOttoThermodynamicStatePoint,
): boolean {
  return (
    Number.isFinite(
      state.temperatureK,
    ) &&
    state.temperatureK >
      0 &&
    Number.isFinite(
      state.pressurePa,
    ) &&
    state.pressurePa >
      0 &&
    Number.isFinite(
      state.specificVolumeM3PerKg,
    ) &&
    state.specificVolumeM3PerKg >
      0
  );
}

export function evaluateIdealOttoFourStateCycle(
  inputState:
    IdealOttoInputState,
): IdealOttoFourStateEvaluation {
  const validated =
    createIdealOttoInputState(
      {
        compressionRatio:
          inputState.compressionRatio,

        initialTemperatureK:
          inputState.initialTemperatureK,

        initialPressurePa:
          inputState.initialPressurePa,

        heatInputJPerKg:
          inputState.heatInputJPerKg,

        gasPropertySetId:
          inputState.gasPropertySetId,
      },
    );

  if (
    !validated.state
  ) {
    return createInvalidResult(
      "Ideal Otto input state is invalid.",
    );
  }

  const canonicalState =
    validated.state;

  const gasProperties =
    resolveGasProperties(
      canonicalState.gasPropertySetId,
    );

  if (
    !gasProperties
  ) {
    return createInvalidResult(
      "Ideal Otto gas property set is unsupported.",
    );
  }

  try {
    const state1 =
      createIdealOttoState1(
        canonicalState
          .initialTemperatureK,

        canonicalState
          .initialPressurePa,

        gasProperties,
      );

    const state2 =
      calculateIdealOttoState2(
        state1,

        canonicalState
          .compressionRatio,

        gasProperties.gamma,
      );

    const state3 =
      calculateIdealOttoState3(
        state2,

        canonicalState
          .heatInputJPerKg,

        gasProperties
          .cvJPerKgK,
      );

    const state4 =
      calculateIdealOttoState4(
        state3,

        canonicalState
          .compressionRatio,

        gasProperties.gamma,
      );

    const states = [
      state1,
      state2,
      state3,
      state4,
    ];

    if (
      !states.every(
        allStateValuesAreFinitePositive,
      )
    ) {
      return createInvalidResult(
        "Ideal Otto cycle produced a non-finite or non-positive thermodynamic state.",
      );
    }

    return {
      modelId:
        IDEAL_OTTO_FOUR_STATE_MODEL_ID,

      modelVersion:
        IDEAL_OTTO_FOUR_STATE_MODEL_VERSION,

      status:
        "valid",

      values: {
        gasProperties,

        states: {
          state1,
          state2,
          state3,
          state4,
        },

        processes:
          IDEAL_OTTO_PROCESS_SEQUENCE,
      },

      assumptions:
        IDEAL_OTTO_ASSUMPTIONS,

      warnings: [],

      issues: [],
    };
  } catch (
    error
  ) {
    return createInvalidResult(
      error instanceof
      Error
        ? error.message
        : "Ideal Otto cycle evaluation failed.",
    );
  }
}

export const idealOttoFourStateModel = {
  id:
    IDEAL_OTTO_FOUR_STATE_MODEL_ID,

  version:
    IDEAL_OTTO_FOUR_STATE_MODEL_VERSION,

  evaluate:
    evaluateIdealOttoFourStateCycle,
} as const;