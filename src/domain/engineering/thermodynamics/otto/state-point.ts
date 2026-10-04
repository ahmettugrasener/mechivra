import type {
  IdealOttoStatePointId,
} from "@/domain/engineering/thermodynamics/otto/processes";

export interface IdealOttoThermodynamicStatePoint {
  readonly id:
    IdealOttoStatePointId;

  readonly temperatureK:
    number;

  readonly pressurePa:
    number;

  readonly specificVolumeM3PerKg:
    number;
}

export interface IdealOttoThermodynamicStatePointInput {
  readonly id:
    IdealOttoStatePointId;

  readonly temperatureK:
    number;

  readonly pressurePa:
    number;

  readonly specificVolumeM3PerKg:
    number;
}

export class IdealOttoStatePointError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "IdealOttoStatePointError";
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
    throw new IdealOttoStatePointError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

export function createIdealOttoThermodynamicStatePoint(
  input:
    IdealOttoThermodynamicStatePointInput,
): IdealOttoThermodynamicStatePoint {
  assertFinitePositive(
    input.temperatureK,
    "Absolute temperature",
  );

  assertFinitePositive(
    input.pressurePa,
    "Absolute pressure",
  );

  assertFinitePositive(
    input.specificVolumeM3PerKg,
    "Specific volume",
  );

  return {
    id:
      input.id,

    temperatureK:
      input.temperatureK,

    pressurePa:
      input.pressurePa,

    specificVolumeM3PerKg:
      input.specificVolumeM3PerKg,
  };
}