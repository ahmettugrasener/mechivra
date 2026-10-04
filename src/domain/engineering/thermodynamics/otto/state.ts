import {
  IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
} from "@/domain/engineering/thermodynamics/otto/gas-properties";

export const IDEAL_OTTO_INPUT_STATE_VERSION =
  "1.0.0" as const;

export const IDEAL_OTTO_MODEL_KIND =
  "ideal_otto_constant_specific_heat" as const;

export interface IdealOttoInputState {
  readonly kind:
    typeof IDEAL_OTTO_MODEL_KIND;

  readonly stateVersion:
    typeof IDEAL_OTTO_INPUT_STATE_VERSION;

  readonly compressionRatio:
    number;

  readonly initialTemperatureK:
    number;

  readonly initialPressurePa:
    number;

  readonly heatInputJPerKg:
    number;

  readonly gasPropertySetId:
    typeof IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID;
}

export interface IdealOttoInputStateInput {
  readonly compressionRatio:
    number;

  readonly initialTemperatureK:
    number;

  readonly initialPressurePa:
    number;

  readonly heatInputJPerKg:
    number;

  readonly gasPropertySetId?:
    string;
}

export type IdealOttoInputIssueCode =
  | "invalid_compression_ratio"
  | "invalid_initial_temperature"
  | "invalid_initial_pressure"
  | "invalid_heat_input"
  | "unsupported_gas_property_set";

export interface IdealOttoInputIssue {
  readonly code:
    IdealOttoInputIssueCode;

  readonly field:
    | "compressionRatio"
    | "initialTemperatureK"
    | "initialPressurePa"
    | "heatInputJPerKg"
    | "gasPropertySetId";

  readonly message:
    string;
}

export interface IdealOttoInputStateResult {
  readonly state:
    IdealOttoInputState | null;

  readonly issues:
    readonly IdealOttoInputIssue[];
}

function isFinitePositive(
  value: number,
): boolean {
  return (
    Number.isFinite(
      value,
    ) &&
    value > 0
  );
}

export function createIdealOttoInputState(
  input:
    IdealOttoInputStateInput,
): IdealOttoInputStateResult {
  const issues:
    IdealOttoInputIssue[] =
    [];

  if (
    !Number.isFinite(
      input.compressionRatio,
    ) ||
    input.compressionRatio <= 1
  ) {
    issues.push({
      code:
        "invalid_compression_ratio",

      field:
        "compressionRatio",

      message:
        "Compression ratio must be finite and greater than one.",
    });
  }

  if (
    !isFinitePositive(
      input.initialTemperatureK,
    )
  ) {
    issues.push({
      code:
        "invalid_initial_temperature",

      field:
        "initialTemperatureK",

      message:
        "Initial absolute temperature must be finite and greater than zero kelvin.",
    });
  }

  if (
    !isFinitePositive(
      input.initialPressurePa,
    )
  ) {
    issues.push({
      code:
        "invalid_initial_pressure",

      field:
        "initialPressurePa",

      message:
        "Initial absolute pressure must be finite and greater than zero.",
    });
  }

  if (
    !isFinitePositive(
      input.heatInputJPerKg,
    )
  ) {
    issues.push({
      code:
        "invalid_heat_input",

      field:
        "heatInputJPerKg",

      message:
        "Specific heat input must be finite and greater than zero.",
    });
  }

  const gasPropertySetId =
    input.gasPropertySetId ??
    IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID;

  if (
    gasPropertySetId !==
    IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID
  ) {
    issues.push({
      code:
        "unsupported_gas_property_set",

      field:
        "gasPropertySetId",

      message:
        "The requested gas property set is not supported by the first Ideal Otto model.",
    });
  }

  if (
    issues.length >
    0
  ) {
    return {
      state:
        null,

      issues,
    };
  }

  return {
    state: {
      kind:
        IDEAL_OTTO_MODEL_KIND,

      stateVersion:
        IDEAL_OTTO_INPUT_STATE_VERSION,

      compressionRatio:
        input.compressionRatio,

      initialTemperatureK:
        input.initialTemperatureK,

      initialPressurePa:
        input.initialPressurePa,

      heatInputJPerKg:
        input.heatInputJPerKg,

      gasPropertySetId:
        IDEAL_OTTO_REFERENCE_AIR_PROPERTY_SET_ID,
    },

    issues: [],
  };
}