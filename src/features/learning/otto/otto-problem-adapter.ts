import type {
  EngineeringProblemDefinition,
  EngineeringProblemResponse,
} from "@/domain/assessment";

import {
  DEFAULT_OTTO_PROBLEM_TOLERANCES,
} from "@/domain/assessment/otto-problem";

import type {
  OttoProblemAnswer,
} from "@/domain/assessment/otto-problem";

import {
  createIdealOttoInputState,
  evaluateIdealOttoCycle,
} from "@/domain/engineering/thermodynamics/otto";

export interface OttoProblemDefinition {
  readonly compressionRatio:
    number;

  readonly initialTemperatureK:
    number;

  readonly initialPressureKPa:
    number;

  readonly heatInputKJPerKg:
    number;

  readonly gasConstantJPerKgK:
    number;

  readonly gamma:
    number;

  readonly expected:
    OttoProblemAnswer;
}

const OTTO_NUMERIC_ASSESSMENT_FIELDS =
  [
    {
      key:
        "state2TemperatureK" as const,

      quantityId:
        "temperature",

      expectedUnitId:
        "K",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .temperatureK,
    },

    {
      key:
        "state2PressureKPa" as const,

      quantityId:
        "pressure",

      expectedUnitId:
        "kPa",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .pressureKPa,
    },

    {
      key:
        "state2SpecificVolumeM3PerKg" as const,

      quantityId:
        "specific_volume",

      expectedUnitId:
        "m3_per_kg",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .specificVolumeM3PerKg,
    },

    {
      key:
        "state3TemperatureK" as const,

      quantityId:
        "temperature",

      expectedUnitId:
        "K",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .temperatureK,
    },

    {
      key:
        "state3PressureKPa" as const,

      quantityId:
        "pressure",

      expectedUnitId:
        "kPa",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .pressureKPa,
    },

    {
      key:
        "state4TemperatureK" as const,

      quantityId:
        "temperature",

      expectedUnitId:
        "K",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .temperatureK,
    },

    {
      key:
        "state4PressureKPa" as const,

      quantityId:
        "pressure",

      expectedUnitId:
        "kPa",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .pressureKPa,
    },

    {
      key:
        "heatRejectedKJPerKg" as const,

      quantityId:
        "specific_energy",

      expectedUnitId:
        "kJ_per_kg",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .specificEnergyKJPerKg,
    },

    {
      key:
        "netWorkKJPerKg" as const,

      quantityId:
        "specific_energy",

      expectedUnitId:
        "kJ_per_kg",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .specificEnergyKJPerKg,
    },

    {
      key:
        "thermalEfficiencyPercent" as const,

      quantityId:
        "efficiency",

      expectedUnitId:
        "percent",

      tolerance:
        DEFAULT_OTTO_PROBLEM_TOLERANCES
          .efficiencyPercent,
    },
  ] as const;

export function createOttoProblemDefinition():
  OttoProblemDefinition {
  const inputResult =
    createIdealOttoInputState(
      {
        compressionRatio:
          6,

        initialTemperatureK:
          320,

        initialPressurePa:
          120_000,

        heatInputJPerKg:
          600_000,
      },
    );

  if (
    !inputResult.state
  ) {
    throw new Error(
      "Expected valid Otto problem input.",
    );
  }

  const result =
    evaluateIdealOttoCycle(
      inputResult.state,
    );

  if (
    !result.values
  ) {
    throw new Error(
      "Expected valid Otto problem analysis.",
    );
  }

  const values =
    result.values;

  return {
    compressionRatio:
      inputResult.state
        .compressionRatio,

    initialTemperatureK:
      inputResult.state
        .initialTemperatureK,

    initialPressureKPa:
      inputResult.state
        .initialPressurePa /
      1000,

    heatInputKJPerKg:
      inputResult.state
        .heatInputJPerKg /
      1000,

    gasConstantJPerKgK:
      values
        .gasProperties
        .gasConstantJPerKgK,

    gamma:
      values
        .gasProperties
        .gamma,

    expected: {
      state2TemperatureK:
        values.states
          .state2
          .temperatureK,

      state2PressureKPa:
        values.states
          .state2
          .pressurePa /
        1000,

      state2SpecificVolumeM3PerKg:
        values.states
          .state2
          .specificVolumeM3PerKg,

      state3TemperatureK:
        values.states
          .state3
          .temperatureK,

      state3PressureKPa:
        values.states
          .state3
          .pressurePa /
        1000,

      state4TemperatureK:
        values.states
          .state4
          .temperatureK,

      state4PressureKPa:
        values.states
          .state4
          .pressurePa /
        1000,

      heatRejectedKJPerKg:
        values.energy
          .heatRejectedJPerKg /
        1000,

      netWorkKJPerKg:
        values.energy
          .netWorkJPerKg /
        1000,

      thermalEfficiencyPercent:
        values.energy
          .thermalEfficiencyFromEnergyBalance *
        100,
    },
  };
}

export function createOttoEngineeringProblemDefinition():
  EngineeringProblemDefinition {
  const problem =
    createOttoProblemDefinition();

  return {
    id:
      "otto-problem",

    version:
      "1.0.0",

    numericItems:
      OTTO_NUMERIC_ASSESSMENT_FIELDS.map(
        (
          field,
        ) => ({
          id:
            field.key,

          expectedValue:
            problem.expected[
              field.key
            ],

          quantityId:
            field.quantityId,

          expectedUnitId:
            field.expectedUnitId,

          tolerance: {
            absolute:
              field.tolerance
                .absolute,

            relative:
              field.tolerance
                .relative,
          },

          maxScore:
            1,
        }),
      ),

    choiceItems:
      [],
  };
}

export function createOttoEngineeringProblemResponse(
  answer:
    OttoProblemAnswer,
): EngineeringProblemResponse {
  return {
    numeric:
      OTTO_NUMERIC_ASSESSMENT_FIELDS.map(
        (
          field,
        ) => ({
          itemId:
            field.key,

          value:
            answer[
              field.key
            ],
        }),
      ),

    choices:
      [],
  };
}