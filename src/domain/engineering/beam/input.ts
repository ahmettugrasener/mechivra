import {
  createSimplySupportedBeamState,
} from "@/domain/engineering/beam/state";

import type {
  BeamStateCreationResult,
} from "@/domain/engineering/beam/types";

import {
  toSI,
} from "@/domain/engineering/units";

export interface BeamLengthInput {
  readonly value: number;

  readonly unit:
    | "m"
    | "cm"
    | "mm";
}

export interface BeamForceInput {
  readonly value: number;

  readonly unit:
    | "N"
    | "kN";
}

export interface SimplySupportedBeamDisplayInput {
  readonly span:
    BeamLengthInput;

  readonly pointLoad:
    BeamForceInput;

  readonly loadPosition:
    BeamLengthInput;
}

function toCanonicalLength(
  value: number,
  unit: BeamLengthInput["unit"],
): number {
  return toSI(
    "length",
    value,
    unit,
  );
}

function toCanonicalForce(
  value: number,
  unit: BeamForceInput["unit"],
): number {
  return toSI(
    "force",
    value,
    unit,
  );
}

export function createSimplySupportedBeamStateFromDisplayInput(
  input: SimplySupportedBeamDisplayInput,
): BeamStateCreationResult {
  const spanM =
    toCanonicalLength(
      input.span.value,
      input.span.unit,
    );

  const pointLoadN =
    toCanonicalForce(
      input.pointLoad.value,
      input.pointLoad.unit,
    );

  const loadPositionM =
    toCanonicalLength(
      input.loadPosition.value,
      input.loadPosition.unit,
    );

  return createSimplySupportedBeamState({
    spanM,
    pointLoadN,
    loadPositionM,
  });
}