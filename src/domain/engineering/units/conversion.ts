import {
  canonicalUnitByQuantity,
  unitDefinitions,
} from "@/domain/engineering/units/definitions";

import type {
  QuantityKind,
  QuantityValue,
  UnitId,
} from "@/domain/engineering/units/types";

export class UnitConversionError extends Error {
  constructor(message: string) {
    super(message);

    this.name =
      "UnitConversionError";
  }
}

function assertFiniteValue(
  value: number,
): void {
  if (!Number.isFinite(value)) {
    throw new UnitConversionError(
      "Unit conversion requires a finite numeric value.",
    );
  }
}

export function isUnitCompatible(
  quantity: QuantityKind,
  unit: UnitId,
): boolean {
  return unitDefinitions[
    unit
  ].quantities.includes(
    quantity,
  );
}

function assertCompatibleUnit(
  quantity: QuantityKind,
  unit: UnitId,
): void {
  if (
    !isUnitCompatible(
      quantity,
      unit,
    )
  ) {
    throw new UnitConversionError(
      `Unit "${unit}" is not compatible with quantity "${quantity}".`,
    );
  }
}

export function toSI(
  quantity: QuantityKind,
  value: number,
  unit: UnitId,
): number {
  assertFiniteValue(value);

  assertCompatibleUnit(
    quantity,
    unit,
  );

  const definition =
    unitDefinitions[unit];

  const siValue =
    value *
      definition.scale +
    definition.offset;

  assertFiniteValue(siValue);

  return siValue;
}

export function fromSI(
  quantity: QuantityKind,
  siValue: number,
  unit: UnitId,
): number {
  assertFiniteValue(siValue);

  assertCompatibleUnit(
    quantity,
    unit,
  );

  const definition =
    unitDefinitions[unit];

  const value =
    (siValue -
      definition.offset) /
    definition.scale;

  assertFiniteValue(value);

  return value;
}

export function convertUnit(
  quantity: QuantityKind,
  value: number,
  fromUnit: UnitId,
  toUnit: UnitId,
): number {
  const siValue = toSI(
    quantity,
    value,
    fromUnit,
  );

  return fromSI(
    quantity,
    siValue,
    toUnit,
  );
}

export function createQuantity(
  quantity: QuantityKind,
  value: number,
  unit: UnitId,
): QuantityValue {
  return {
    quantity,
    siValue: toSI(
      quantity,
      value,
      unit,
    ),
  };
}

export function getCanonicalUnit(
  quantity: QuantityKind,
): UnitId {
  return canonicalUnitByQuantity[
    quantity
  ];
}

export function formatUnitSymbol(
  unit: UnitId,
): string {
  return unitDefinitions[
    unit
  ].symbol;
}