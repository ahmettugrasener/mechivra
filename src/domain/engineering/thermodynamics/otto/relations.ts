import type {
  ConstantSpecificHeatIdealGasPropertySet,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

import {
  createIdealOttoThermodynamicStatePoint,
} from "@/domain/engineering/thermodynamics/otto/state-point";

import type {
  IdealOttoThermodynamicStatePoint,
} from "@/domain/engineering/thermodynamics/otto/state-point";

export class IdealOttoProcessRelationError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "IdealOttoProcessRelationError";
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
    throw new IdealOttoProcessRelationError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

function assertCompressionRatio(
  compressionRatio:
    number,
): void {
  if (
    !Number.isFinite(
      compressionRatio,
    ) ||
    compressionRatio <= 1
  ) {
    throw new IdealOttoProcessRelationError(
      "Compression ratio must be finite and greater than one.",
    );
  }
}

function assertGamma(
  gamma:
    number,
): void {
  if (
    !Number.isFinite(
      gamma,
    ) ||
    gamma <= 1
  ) {
    throw new IdealOttoProcessRelationError(
      "Specific-heat ratio gamma must be finite and greater than one.",
    );
  }
}

export function calculateIdealGasSpecificVolumeM3PerKg(
  temperatureK:
    number,

  pressurePa:
    number,

  gasConstantJPerKgK:
    number,
): number {
  assertFinitePositive(
    temperatureK,
    "Absolute temperature",
  );

  assertFinitePositive(
    pressurePa,
    "Absolute pressure",
  );

  assertFinitePositive(
    gasConstantJPerKgK,
    "Specific gas constant",
  );

  const specificVolumeM3PerKg =
    (
      gasConstantJPerKgK *
      temperatureK
    ) /
    pressurePa;

  if (
    !Number.isFinite(
      specificVolumeM3PerKg,
    ) ||
    specificVolumeM3PerKg <= 0
  ) {
    throw new IdealOttoProcessRelationError(
      "Ideal-gas specific volume calculation did not produce a finite positive result.",
    );
  }

  return specificVolumeM3PerKg;
}

export function createIdealOttoState1(
  initialTemperatureK:
    number,

  initialPressurePa:
    number,

  gas:
    ConstantSpecificHeatIdealGasPropertySet,
): IdealOttoThermodynamicStatePoint {
  const specificVolumeM3PerKg =
    calculateIdealGasSpecificVolumeM3PerKg(
      initialTemperatureK,
      initialPressurePa,
      gas.gasConstantJPerKgK,
    );

  return createIdealOttoThermodynamicStatePoint(
    {
      id:
        1,

      temperatureK:
        initialTemperatureK,

      pressurePa:
        initialPressurePa,

      specificVolumeM3PerKg,
    },
  );
}

export function calculateIdealOttoState2(
  state1:
    IdealOttoThermodynamicStatePoint,

  compressionRatio:
    number,

  gamma:
    number,
): IdealOttoThermodynamicStatePoint {
  assertCompressionRatio(
    compressionRatio,
  );

  assertGamma(
    gamma,
  );

  const temperatureRatio =
    compressionRatio **
    (
      gamma -
      1
    );

  const pressureRatio =
    compressionRatio **
    gamma;

  const temperatureK =
    state1.temperatureK *
    temperatureRatio;

  const pressurePa =
    state1.pressurePa *
    pressureRatio;

  const specificVolumeM3PerKg =
    state1.specificVolumeM3PerKg /
    compressionRatio;

  return createIdealOttoThermodynamicStatePoint(
    {
      id:
        2,

      temperatureK,

      pressurePa,

      specificVolumeM3PerKg,
    },
  );
}

export function calculateIdealOttoState3(
  state2:
    IdealOttoThermodynamicStatePoint,

  heatInputJPerKg:
    number,

  cvJPerKgK:
    number,
): IdealOttoThermodynamicStatePoint {
  assertFinitePositive(
    heatInputJPerKg,
    "Specific heat input",
  );

  assertFinitePositive(
    cvJPerKgK,
    "Constant-volume specific heat",
  );

  const temperatureK =
    state2.temperatureK +
    heatInputJPerKg /
      cvJPerKgK;

  const pressurePa =
    state2.pressurePa *
    (
      temperatureK /
      state2.temperatureK
    );

  return createIdealOttoThermodynamicStatePoint(
    {
      id:
        3,

      temperatureK,

      pressurePa,

      specificVolumeM3PerKg:
        state2.specificVolumeM3PerKg,
    },
  );
}

export function calculateIdealOttoState4(
  state3:
    IdealOttoThermodynamicStatePoint,

  compressionRatio:
    number,

  gamma:
    number,
): IdealOttoThermodynamicStatePoint {
  assertCompressionRatio(
    compressionRatio,
  );

  assertGamma(
    gamma,
  );

  const temperatureRatio =
    compressionRatio **
    (
      gamma -
      1
    );

  const pressureRatio =
    compressionRatio **
    gamma;

  const temperatureK =
    state3.temperatureK /
    temperatureRatio;

  const pressurePa =
    state3.pressurePa /
    pressureRatio;

  const specificVolumeM3PerKg =
    state3.specificVolumeM3PerKg *
    compressionRatio;

  return createIdealOttoThermodynamicStatePoint(
    {
      id:
        4,

      temperatureK,

      pressurePa,

      specificVolumeM3PerKg,
    },
  );
}