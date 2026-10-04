export const BEAM_STATICS_MODEL_ID =
  "beam-statics-simply-supported-point-load" as const;

export const BEAM_STATICS_MODEL_VERSION =
  "1.0.0" as const;

export type BeamShearEvaluationSide =
  | "left"
  | "right";

export interface BeamShearSegment {
  /**
   * Segment start in metres.
   */
  readonly xStartM: number;

  /**
   * Segment end in metres.
   */
  readonly xEndM: number;

  /**
   * Constant internal shear force
   * over the open segment.
   */
  readonly valueN: number;
}

export interface BeamMomentSegment {
  /**
   * Segment start in metres.
   */
  readonly xStartM: number;

  /**
   * Segment end in metres.
   */
  readonly xEndM: number;

  /**
   * M(x) = slopeN * x + interceptNm
   */
  readonly slopeN: number;

  readonly interceptNm: number;
}

export interface BeamMaximumMomentPointLocation {
  readonly type: "point";
  readonly xM: number;
}

export interface BeamMaximumMomentIntervalLocation {
  readonly type: "interval";
  readonly xStartM: number;
  readonly xEndM: number;
}

export type BeamMaximumMomentLocation =
  | BeamMaximumMomentPointLocation
  | BeamMaximumMomentIntervalLocation;

export interface BeamMaximumMoment {
  readonly valueNm: number;

  readonly location:
    BeamMaximumMomentLocation;
}

export interface BeamStaticsValues {
  /**
   * Canonical input state repeated in the result so
   * diagram consumers have a self-contained result.
   */
  readonly spanM: number;
  readonly pointLoadN: number;
  readonly loadPositionM: number;

  /**
   * Upward support reactions are positive.
   */
  readonly leftReactionN: number;
  readonly rightReactionN: number;

  readonly shear: {
    /**
     * Shear immediately to the left of the point load.
     */
    readonly leftOfLoadN: number;

    /**
     * Shear immediately to the right of the point load.
     */
    readonly rightOfLoadN: number;

    /**
     * Downward point load causes a negative jump.
     */
    readonly loadJumpN: number;

    readonly segments:
      readonly BeamShearSegment[];
  };

  readonly moment: {
    readonly segments:
      readonly BeamMomentSegment[];

    readonly maximum:
      BeamMaximumMoment;
  };
}