export interface OttoProblemAnswer {
  readonly state2TemperatureK:
    number;

  readonly state2PressureKPa:
    number;

  readonly state2SpecificVolumeM3PerKg:
    number;

  readonly state3TemperatureK:
    number;

  readonly state3PressureKPa:
    number;

  readonly state4TemperatureK:
    number;

  readonly state4PressureKPa:
    number;

  readonly heatRejectedKJPerKg:
    number;

  readonly netWorkKJPerKg:
    number;

  readonly thermalEfficiencyPercent:
    number;
}

export interface OttoProblemTolerance {
  readonly absolute:
    number;

  readonly relative:
    number;
}

export interface OttoProblemTolerances {
  readonly temperatureK:
    OttoProblemTolerance;

  readonly pressureKPa:
    OttoProblemTolerance;

  readonly specificVolumeM3PerKg:
    OttoProblemTolerance;

  readonly specificEnergyKJPerKg:
    OttoProblemTolerance;

  readonly efficiencyPercent:
    OttoProblemTolerance;
}

export const DEFAULT_OTTO_PROBLEM_TOLERANCES:
  OttoProblemTolerances =
  {
    temperatureK: {
      absolute:
        0.5,

      relative:
        0.001,
    },

    pressureKPa: {
      absolute:
        1,

      relative:
        0.001,
    },

    specificVolumeM3PerKg: {
      absolute:
        0.0005,

      relative:
        0.002,
    },

    specificEnergyKJPerKg: {
      absolute:
        0.5,

      relative:
        0.001,
    },

    efficiencyPercent: {
      absolute:
        0.05,

      relative:
        0.001,
    },
  };