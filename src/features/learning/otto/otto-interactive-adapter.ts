import {
  createIdealOttoInputState,
  createIdealOttoPvProcessCurves,
  evaluateIdealOttoCycle,
} from "@/domain/engineering/thermodynamics/otto";

import type {
  IdealOttoPvProcessCurve,
} from "@/domain/engineering/thermodynamics/otto";

export interface OttoInteractiveInput {
  readonly compressionRatio:
    number;

  readonly heatInputKJPerKg:
    number;
}

export interface OttoInteractiveStatePoint {
  readonly id:
    1 | 2 | 3 | 4;

  readonly temperatureK:
    number;

  readonly pressureKPa:
    number;

  readonly specificVolumeM3PerKg:
    number;
}

export interface OttoInteractiveSnapshot {
  readonly compressionRatio:
    number;

  readonly heatInputKJPerKg:
    number;

  readonly gamma:
    number;

  readonly states: {
    readonly state1:
      OttoInteractiveStatePoint;

    readonly state2:
      OttoInteractiveStatePoint;

    readonly state3:
      OttoInteractiveStatePoint;

    readonly state4:
      OttoInteractiveStatePoint;
  };

  readonly heatRejectedKJPerKg:
    number;

  readonly netWorkKJPerKg:
    number;

  readonly thermalEfficiencyPercent:
    number;

  readonly curves:
    readonly IdealOttoPvProcessCurve[];
}

function toInteractiveStatePoint(
  state: {
    readonly id:
      1 | 2 | 3 | 4;

    readonly temperatureK:
      number;

    readonly pressurePa:
      number;

    readonly specificVolumeM3PerKg:
      number;
  },
): OttoInteractiveStatePoint {
  return {
    id:
      state.id,

    temperatureK:
      state.temperatureK,

    pressureKPa:
      state.pressurePa /
      1000,

    specificVolumeM3PerKg:
      state.specificVolumeM3PerKg,
  };
}

export function evaluateOttoInteractiveState(
  input:
    OttoInteractiveInput,
): OttoInteractiveSnapshot {
  const inputStateResult =
    createIdealOttoInputState(
      {
        compressionRatio:
          input.compressionRatio,

        initialTemperatureK:
          300,

        initialPressurePa:
          100_000,

        heatInputJPerKg:
          input.heatInputKJPerKg *
          1000,
      },
    );

  if (
    !inputStateResult.state
  ) {
    throw new Error(
      "Interactive Otto input did not produce a valid canonical state.",
    );
  }

  const analysis =
    evaluateIdealOttoCycle(
      inputStateResult.state,
    );

  if (
    !analysis.values
  ) {
    throw new Error(
      "Interactive Otto analysis did not produce valid cycle values.",
    );
  }

  const values =
    analysis.values;

  const curves =
    createIdealOttoPvProcessCurves(
      values.states,
      values
        .gasProperties
        .gamma,
    );

  return {
    compressionRatio:
      input.compressionRatio,

    heatInputKJPerKg:
      input.heatInputKJPerKg,

    gamma:
      values
        .gasProperties
        .gamma,

    states: {
      state1:
        toInteractiveStatePoint(
          values.states
            .state1,
        ),

      state2:
        toInteractiveStatePoint(
          values.states
            .state2,
        ),

      state3:
        toInteractiveStatePoint(
          values.states
            .state3,
        ),

      state4:
        toInteractiveStatePoint(
          values.states
            .state4,
        ),
    },

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

    curves,
  };
}