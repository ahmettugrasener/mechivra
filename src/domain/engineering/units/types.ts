export type QuantityKind =
  | "length"
  | "force"
  | "pressure"
  | "stress"
  | "elastic_modulus"
  | "moment"
  | "area"
  | "second_moment_area"
  | "absolute_temperature"
  | "temperature_difference"
  | "specific_energy"
  | "specific_volume"
  | "dimensionless";

export type UnitId =
  | "m"
  | "cm"
  | "mm"
  | "N"
  | "kN"
  | "Pa"
  | "kPa"
  | "MPa"
  | "GPa"
  | "N_m"
  | "kN_m"
  | "m2"
  | "cm2"
  | "mm2"
  | "m4"
  | "cm4"
  | "mm4"
  | "K"
  | "degC"
  | "deltaK"
  | "deltaDegC"
  | "J_per_kg"
  | "kJ_per_kg"
  | "m3_per_kg"
  | "L_per_kg"
  | "one"
  | "percent";

export interface UnitDefinition {
  readonly id: UnitId;

  readonly symbol: string;

  readonly quantities: readonly QuantityKind[];

  /**
   * Canonical SI conversion:
   *
   * siValue = value * scale + offset
   */
  readonly scale: number;

  readonly offset: number;
}

export interface QuantityValue {
  readonly quantity: QuantityKind;

  /**
   * Canonical SI value.
   */
  readonly siValue: number;
}