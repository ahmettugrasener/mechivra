import {
  createIdealOttoInputState,
  evaluateIdealOttoCycle,
} from "@/domain/engineering/thermodynamics/otto";

export interface OttoWorkedExampleSnapshot {
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

  readonly cvJPerKgK:
    number;

  readonly cpJPerKgK:
    number;

  readonly states: {
    readonly state1: {
      readonly temperatureK:
        number;

      readonly pressureKPa:
        number;

      readonly specificVolumeM3PerKg:
        number;
    };

    readonly state2: {
      readonly temperatureK:
        number;

      readonly pressureKPa:
        number;

      readonly specificVolumeM3PerKg:
        number;
    };

    readonly state3: {
      readonly temperatureK:
        number;

      readonly pressureKPa:
        number;

      readonly specificVolumeM3PerKg:
        number;
    };

    readonly state4: {
      readonly temperatureK:
        number;

      readonly pressureKPa:
        number;

      readonly specificVolumeM3PerKg:
        number;
    };
  };

  readonly heatRejectedKJPerKg:
    number;

  readonly netWorkKJPerKg:
    number;

  readonly thermalEfficiencyPercent:
    number;

  readonly thermalEfficiencyFromCompressionRatioPercent:
    number;
}

function displayState(
  state: {
    readonly temperatureK:
      number;

    readonly pressurePa:
      number;

    readonly specificVolumeM3PerKg:
      number;
  },
) {
  return {
    temperatureK:
      state.temperatureK,

    pressureKPa:
      state.pressurePa /
      1000,

    specificVolumeM3PerKg:
      state.specificVolumeM3PerKg,
  };
}

export function createOttoWorkedExampleSnapshot():
  OttoWorkedExampleSnapshot {
  const inputResult =
    createIdealOttoInputState(
      {
        compressionRatio:
          8,

        initialTemperatureK:
          300,

        initialPressurePa:
          100_000,

        heatInputJPerKg:
          800_000,
      },
    );

  if (
    !inputResult.state
  ) {
    throw new Error(
      "Expected valid Otto worked-example input.",
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
      "Expected valid Otto worked-example analysis.",
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

    cvJPerKgK:
      values
        .gasProperties
        .cvJPerKgK,

    cpJPerKgK:
      values
        .gasProperties
        .cpJPerKgK,

    states: {
      state1:
        displayState(
          values.states
            .state1,
        ),

      state2:
        displayState(
          values.states
            .state2,
        ),

      state3:
        displayState(
          values.states
            .state3,
        ),

      state4:
        displayState(
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

    thermalEfficiencyFromCompressionRatioPercent:
      values.energy
        .thermalEfficiencyFromCompressionRatio *
      100,
  };
}