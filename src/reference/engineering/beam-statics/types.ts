export interface ReferenceTolerance {
  /**
   * Absolute tolerance in the canonical SI unit
   * of the compared quantity.
   */
  readonly absolute: number;

  /**
   * Dimensionless relative tolerance.
   */
  readonly relative: number;
}

export interface BeamStaticsReferenceInput {
  /**
   * Canonical SI metres.
   */
  readonly spanM: number;

  /**
   * Canonical SI newtons.
   */
  readonly pointLoadN: number;

  /**
   * Canonical SI metres from the left support.
   */
  readonly loadPositionM: number;
}

export interface BeamStaticsReferenceShear {
  readonly leftOfLoadN: number;
  readonly rightOfLoadN: number;
}

export interface BeamStaticsReferenceMomentPoint {
  readonly xM: number;
  readonly expectedMomentNm: number;
}

export interface BeamStaticsReferenceExpected {
  readonly leftReactionN: number;
  readonly rightReactionN: number;

  readonly maximumMomentNm: number;
  readonly maximumMomentPositionM: number;

  readonly shear?: BeamStaticsReferenceShear;

  readonly momentPoints?:
    readonly BeamStaticsReferenceMomentPoint[];
}

export interface BeamStaticsReferenceCase {
  readonly id: string;

  readonly title: string;

  /**
   * Human-readable description of how the
   * expected values were established.
   *
   * This is metadata only. It is not executable
   * production logic.
   */
  readonly independentMethod: string;

  readonly sourceIds:
    readonly string[];

  readonly input:
    BeamStaticsReferenceInput;

  readonly expected:
    BeamStaticsReferenceExpected;

  readonly tolerance:
    ReferenceTolerance;
}