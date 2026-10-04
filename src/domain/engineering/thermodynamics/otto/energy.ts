import type {
  ConstantSpecificHeatIdealGasPropertySet,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

import type {
  IdealOttoThermodynamicStatePoint,
} from "@/domain/engineering/thermodynamics/otto/state-point";

export const IDEAL_OTTO_ENERGY_SIGN_CONVENTION =
  {
    heatInput:
      "positive_into_cycle",

    heatRejected:
      "positive_rejected_magnitude",

    netWork:
      "positive_cycle_output",
  } as const;

export interface IdealOttoEnergyPerformance {
  readonly heatInputJPerKg:
    number;

  readonly heatRejectedJPerKg:
    number;

  readonly netWorkJPerKg:
    number;

  readonly thermalEfficiencyFromEnergyBalance:
    number;

  readonly thermalEfficiencyFromCompressionRatio:
    number;

  readonly energyBalanceResidualJPerKg:
    number;

  readonly efficiencyResidual:
    number;
}

export interface IdealOttoEnergyPerformanceInput {
  readonly state1:
    IdealOttoThermodynamicStatePoint;

  readonly state4:
    IdealOttoThermodynamicStatePoint;

  readonly heatInputJPerKg:
    number;

  readonly compressionRatio:
    number;

  readonly gasProperties:
    ConstantSpecificHeatIdealGasPropertySet;
}

export class IdealOttoEnergyCalculationError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "IdealOttoEnergyCalculationError";
  }
}

function assertFinitePositive(
  value: number,
  name: string,
): void {
  if (
    !Number.isFinite(
      value,
    ) ||
    value <= 0
  ) {
    throw new IdealOttoEnergyCalculationError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

function canonicalizeZero(
  value: number,
): number {
  return Object.is(
    value,
    -0,
  )
    ? 0
    : value;
}

export function calculateIdealOttoHeatRejectedJPerKg(
  state1TemperatureK:
    number,

  state4TemperatureK:
    number,

  cvJPerKgK:
    number,
): number {
  assertFinitePositive(
    state1TemperatureK,
    "State-1 absolute temperature",
  );

  assertFinitePositive(
    state4TemperatureK,
    "State-4 absolute temperature",
  );

  assertFinitePositive(
    cvJPerKgK,
    "Constant-volume specific heat",
  );

  const heatRejectedJPerKg =
    cvJPerKgK *
    (
      state4TemperatureK -
      state1TemperatureK
    );

  if (
    !Number.isFinite(
      heatRejectedJPerKg,
    ) ||
    heatRejectedJPerKg < 0
  ) {
    throw new IdealOttoEnergyCalculationError(
      "Heat-rejection magnitude must be finite and greater than or equal to zero.",
    );
  }

  return canonicalizeZero(
    heatRejectedJPerKg,
  );
}

export function calculateIdealOttoThermalEfficiencyFromCompressionRatio(
  compressionRatio:
    number,

  gamma:
    number,
): number {
  if (
    !Number.isFinite(
      compressionRatio,
    ) ||
    compressionRatio <= 1
  ) {
    throw new IdealOttoEnergyCalculationError(
      "Compression ratio must be finite and greater than one.",
    );
  }

  if (
    !Number.isFinite(
      gamma,
    ) ||
    gamma <= 1
  ) {
    throw new IdealOttoEnergyCalculationError(
      "Specific-heat ratio gamma must be finite and greater than one.",
    );
  }

  const efficiency =
    1 -
    1 /
      (
        compressionRatio **
        (
          gamma -
          1
        )
      );

  if (
    !Number.isFinite(
      efficiency,
    ) ||
    efficiency <= 0 ||
    efficiency >= 1
  ) {
    throw new IdealOttoEnergyCalculationError(
      "Ideal Otto thermal efficiency must lie strictly between zero and one.",
    );
  }

  return efficiency;
}

export function calculateIdealOttoEnergyPerformance(
  input:
    IdealOttoEnergyPerformanceInput,
): IdealOttoEnergyPerformance {
  assertFinitePositive(
    input.heatInputJPerKg,
    "Specific heat input",
  );

  const heatRejectedJPerKg =
    calculateIdealOttoHeatRejectedJPerKg(
      input.state1
        .temperatureK,

      input.state4
        .temperatureK,

      input.gasProperties
        .cvJPerKgK,
    );

  const netWorkJPerKg =
    input.heatInputJPerKg -
    heatRejectedJPerKg;

  if (
    !Number.isFinite(
      netWorkJPerKg,
    ) ||
    netWorkJPerKg <= 0
  ) {
    throw new IdealOttoEnergyCalculationError(
      "Net specific work output must be finite and greater than zero.",
    );
  }

  const thermalEfficiencyFromEnergyBalance =
    netWorkJPerKg /
    input.heatInputJPerKg;

  if (
    !Number.isFinite(
      thermalEfficiencyFromEnergyBalance,
    ) ||
    thermalEfficiencyFromEnergyBalance <=
      0 ||
    thermalEfficiencyFromEnergyBalance >=
      1
  ) {
    throw new IdealOttoEnergyCalculationError(
      "Energy-based thermal efficiency must lie strictly between zero and one.",
    );
  }

  const thermalEfficiencyFromCompressionRatio =
    calculateIdealOttoThermalEfficiencyFromCompressionRatio(
      input.compressionRatio,
      input.gasProperties.gamma,
    );

  const energyBalanceResidualJPerKg =
    (
      input.heatInputJPerKg -
      heatRejectedJPerKg
    ) -
    netWorkJPerKg;

  const efficiencyResidual =
    thermalEfficiencyFromEnergyBalance -
    thermalEfficiencyFromCompressionRatio;

  return {
    heatInputJPerKg:
      input.heatInputJPerKg,

    heatRejectedJPerKg,

    netWorkJPerKg,

    thermalEfficiencyFromEnergyBalance,

    thermalEfficiencyFromCompressionRatio,

    energyBalanceResidualJPerKg:
      canonicalizeZero(
        energyBalanceResidualJPerKg,
      ),

    efficiencyResidual:
      canonicalizeZero(
        efficiencyResidual,
      ),
  };
}