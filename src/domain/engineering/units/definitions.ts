import type {
  QuantityKind,
  UnitDefinition,
  UnitId,
} from "@/domain/engineering/units/types";

const pressureQuantities = [
  "pressure",
  "stress",
  "elastic_modulus",
] as const satisfies readonly QuantityKind[];

export const unitDefinitions: Readonly<
  Record<UnitId, UnitDefinition>
> = {
  m: {
    id: "m",
    symbol: "m",
    quantities: ["length"],
    scale: 1,
    offset: 0,
  },

  cm: {
    id: "cm",
    symbol: "cm",
    quantities: ["length"],
    scale: 1e-2,
    offset: 0,
  },

  mm: {
    id: "mm",
    symbol: "mm",
    quantities: ["length"],
    scale: 1e-3,
    offset: 0,
  },

  N: {
    id: "N",
    symbol: "N",
    quantities: ["force"],
    scale: 1,
    offset: 0,
  },

  kN: {
    id: "kN",
    symbol: "kN",
    quantities: ["force"],
    scale: 1e3,
    offset: 0,
  },

  Pa: {
    id: "Pa",
    symbol: "Pa",
    quantities: pressureQuantities,
    scale: 1,
    offset: 0,
  },

  kPa: {
    id: "kPa",
    symbol: "kPa",
    quantities: pressureQuantities,
    scale: 1e3,
    offset: 0,
  },

  MPa: {
    id: "MPa",
    symbol: "MPa",
    quantities: pressureQuantities,
    scale: 1e6,
    offset: 0,
  },

  GPa: {
    id: "GPa",
    symbol: "GPa",
    quantities: pressureQuantities,
    scale: 1e9,
    offset: 0,
  },

  N_m: {
    id: "N_m",
    symbol: "N·m",
    quantities: ["moment"],
    scale: 1,
    offset: 0,
  },

  kN_m: {
    id: "kN_m",
    symbol: "kN·m",
    quantities: ["moment"],
    scale: 1e3,
    offset: 0,
  },

  m2: {
    id: "m2",
    symbol: "m²",
    quantities: ["area"],
    scale: 1,
    offset: 0,
  },

  cm2: {
    id: "cm2",
    symbol: "cm²",
    quantities: ["area"],
    scale: 1e-4,
    offset: 0,
  },

  mm2: {
    id: "mm2",
    symbol: "mm²",
    quantities: ["area"],
    scale: 1e-6,
    offset: 0,
  },

  m4: {
    id: "m4",
    symbol: "m⁴",
    quantities: [
      "second_moment_area",
    ],
    scale: 1,
    offset: 0,
  },

  cm4: {
    id: "cm4",
    symbol: "cm⁴",
    quantities: [
      "second_moment_area",
    ],
    scale: 1e-8,
    offset: 0,
  },

  mm4: {
    id: "mm4",
    symbol: "mm⁴",
    quantities: [
      "second_moment_area",
    ],
    scale: 1e-12,
    offset: 0,
  },

  K: {
    id: "K",
    symbol: "K",
    quantities: [
      "absolute_temperature",
    ],
    scale: 1,
    offset: 0,
  },

  degC: {
    id: "degC",
    symbol: "°C",
    quantities: [
      "absolute_temperature",
    ],
    scale: 1,
    offset: 273.15,
  },

  deltaK: {
    id: "deltaK",
    symbol: "K",
    quantities: [
      "temperature_difference",
    ],
    scale: 1,
    offset: 0,
  },

  deltaDegC: {
    id: "deltaDegC",
    symbol: "°C",
    quantities: [
      "temperature_difference",
    ],
    scale: 1,
    offset: 0,
  },

  J_per_kg: {
    id: "J_per_kg",
    symbol: "J/kg",
    quantities: [
      "specific_energy",
    ],
    scale: 1,
    offset: 0,
  },

  kJ_per_kg: {
    id: "kJ_per_kg",
    symbol: "kJ/kg",
    quantities: [
      "specific_energy",
    ],
    scale: 1e3,
    offset: 0,
  },

  m3_per_kg: {
    id: "m3_per_kg",
    symbol: "m³/kg",
    quantities: [
      "specific_volume",
    ],
    scale: 1,
    offset: 0,
  },

  L_per_kg: {
    id: "L_per_kg",
    symbol: "L/kg",
    quantities: [
      "specific_volume",
    ],
    scale: 1e-3,
    offset: 0,
  },

  one: {
    id: "one",
    symbol: "1",
    quantities: [
      "dimensionless",
    ],
    scale: 1,
    offset: 0,
  },

  percent: {
    id: "percent",
    symbol: "%",
    quantities: [
      "dimensionless",
    ],
    scale: 1e-2,
    offset: 0,
  },
};

export const canonicalUnitByQuantity: Readonly<
  Record<QuantityKind, UnitId>
> = {
  length: "m",
  force: "N",
  pressure: "Pa",
  stress: "Pa",
  elastic_modulus: "Pa",
  moment: "N_m",
  area: "m2",
  second_moment_area: "m4",
  absolute_temperature: "K",
  temperature_difference: "deltaK",
  specific_energy: "J_per_kg",
  specific_volume: "m3_per_kg",
  dimensionless: "one",
};