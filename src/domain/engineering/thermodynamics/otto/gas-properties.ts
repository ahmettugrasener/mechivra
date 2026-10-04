export const IDEAL_OTTO_GAS_PROPERTY_SET_VERSION =
  "1.0.0" as const;

export const IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID =
  "air-constant-specific-heats-r287-gamma1.4" as const;

export interface ConstantSpecificHeatIdealGasPropertySet {
  readonly id:
    string;

  readonly version:
    typeof IDEAL_OTTO_GAS_PROPERTY_SET_VERSION;

  readonly kind:
    "constant_specific_heat_ideal_gas";

  readonly gasConstantJPerKgK:
    number;

  readonly gamma:
    number;

  readonly cvJPerKgK:
    number;

  readonly cpJPerKgK:
    number;
}

export interface ConstantSpecificHeatIdealGasPropertySetInput {
  readonly id:
    string;

  readonly gasConstantJPerKgK:
    number;

  readonly gamma:
    number;
}

export class IdealGasPropertySetError extends Error {
  constructor(
    message: string,
  ) {
    super(message);

    this.name =
      "IdealGasPropertySetError";
  }
}

function assertNonEmptyString(
  value: string,
  name: string,
): void {
  if (
    value.trim().length ===
    0
  ) {
    throw new IdealGasPropertySetError(
      `${name} must not be empty.`,
    );
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
    throw new IdealGasPropertySetError(
      `${name} must be finite and greater than zero.`,
    );
  }
}

export function createConstantSpecificHeatIdealGasPropertySet(
  input:
    ConstantSpecificHeatIdealGasPropertySetInput,
): ConstantSpecificHeatIdealGasPropertySet {
  assertNonEmptyString(
    input.id,
    "Property-set ID",
  );

  assertFinitePositive(
    input.gasConstantJPerKgK,
    "Specific gas constant",
  );

  if (
    !Number.isFinite(
      input.gamma,
    ) ||
    input.gamma <= 1
  ) {
    throw new IdealGasPropertySetError(
      "Specific-heat ratio gamma must be finite and greater than one.",
    );
  }

  /*
   * For an ideal gas:
   *
   *   cp - cv = R
   *   gamma   = cp / cv
   *
   * Therefore, R and gamma are the independent stored
   * quantities and cp/cv are derived consistently.
   *
   * This prevents the UI from supplying mutually
   * contradictory R, cp, cv, and gamma values.
   */
  const cvJPerKgK =
    input.gasConstantJPerKgK /
    (
      input.gamma -
      1
    );

  const cpJPerKgK =
    cvJPerKgK +
    input.gasConstantJPerKgK;

  if (
    !Number.isFinite(
      cvJPerKgK,
    ) ||
    !Number.isFinite(
      cpJPerKgK,
    )
  ) {
    throw new IdealGasPropertySetError(
      "Derived specific heats must be finite.",
    );
  }

  return {
    id:
      input.id,

    version:
      IDEAL_OTTO_GAS_PROPERTY_SET_VERSION,

    kind:
      "constant_specific_heat_ideal_gas",

    gasConstantJPerKgK:
      input.gasConstantJPerKgK,

    gamma:
      input.gamma,

    cvJPerKgK,

    cpJPerKgK,
  };
}

export const IDEAL_OTTO_REFERENCE_AIR_PROPERTIES =
  createConstantSpecificHeatIdealGasPropertySet(
    {
      id:
        IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,

      gasConstantJPerKgK:
        287,

      gamma:
        1.4,
    },
  );