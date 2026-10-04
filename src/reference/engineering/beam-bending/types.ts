export interface ReferenceTolerance {
  readonly absolute:
    number;

  readonly relative:
    number;
}

export interface BeamBendingReferenceTolerances {
  readonly maximumMomentNm:
    ReferenceTolerance;

  readonly secondMomentAreaM4:
    ReferenceTolerance;

  readonly elasticSectionModulusM3:
    ReferenceTolerance;

  readonly stressPa:
    ReferenceTolerance;

  readonly deflectionM:
    ReferenceTolerance;

  readonly positionM:
    ReferenceTolerance;
}

export type ReferenceCriterionStatus =
  | "satisfied"
  | "not_satisfied"
  | "undetermined";

export interface BeamBendingReferenceInput {
  readonly spanM:
    number;

  readonly pointLoadN:
    number;

  readonly loadPositionM:
    number;

  readonly sectionWidthM:
    number;

  readonly sectionHeightM:
    number;

  readonly elasticModulusPa:
    number;

  readonly allowableBendingStressPa:
    number | null;

  readonly allowableDeflectionM:
    number | null;
}

export interface BeamBendingReferenceExpected {
  readonly maximumMomentNm:
    number;

  readonly secondMomentAreaM4:
    number;

  readonly elasticSectionModulusM3:
    number;

  readonly topFiberStressPa:
    number;

  readonly bottomFiberStressPa:
    number;

  readonly maximumAbsoluteStressPa:
    number;

  readonly maximumAbsoluteDeflectionM:
    number;

  readonly signedDeflectionAtMaximumM:
    number;

  readonly maximumDeflectionPositionM:
    number;

  readonly bendingStressCriterion:
    ReferenceCriterionStatus;

  readonly deflectionCriterion:
    ReferenceCriterionStatus;
}

export interface BeamBendingReferenceCase {
  readonly id:
    string;

  readonly description:
    string;

  readonly referenceMethod:
    string;

  readonly sourceIds:
    readonly string[];

  readonly input:
    BeamBendingReferenceInput;

  readonly expected:
    BeamBendingReferenceExpected;

  readonly tolerance:
    BeamBendingReferenceTolerances;
}