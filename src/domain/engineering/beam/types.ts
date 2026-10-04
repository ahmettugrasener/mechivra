import type {
  EngineeringValidityIssue,
} from "@/domain/engineering/contracts";

export const SIMPLY_SUPPORTED_BEAM_STATE_VERSION =
  "1.0.0" as const;

export const SIMPLY_SUPPORTED_BEAM_TYPE =
  "simply_supported_beam_point_load" as const;

export type BeamSupportConfiguration =
  "pin_left_roller_right";

export type BeamVerticalLoadDirection =
  "downward";

export interface SimplySupportedBeamStateInput {
  /**
   * Beam span in canonical SI metres.
   */
  readonly spanM: number;

  /**
   * Magnitude of the single vertical point load
   * in canonical SI newtons.
   *
   * MVP convention:
   * - magnitude is non-negative
   * - direction is explicitly stored as downward
   */
  readonly pointLoadN: number;

  /**
   * Point-load position measured from the
   * left support in canonical SI metres.
   */
  readonly loadPositionM: number;
}

export interface SimplySupportedBeamState {
  readonly type:
    typeof SIMPLY_SUPPORTED_BEAM_TYPE;

  readonly stateVersion:
    typeof SIMPLY_SUPPORTED_BEAM_STATE_VERSION;

  readonly supportConfiguration:
    BeamSupportConfiguration;

  /**
   * Global beam coordinate:
   * x = 0 at the left support,
   * x = spanM at the right support.
   */
  readonly coordinateOrigin:
    "left_support";

  readonly positiveXDirection:
    "left_to_right";

  readonly pointLoadDirection:
    BeamVerticalLoadDirection;

  readonly spanM: number;
  readonly pointLoadN: number;
  readonly loadPositionM: number;
}

export interface BeamStateCreationResult {
  readonly state:
    SimplySupportedBeamState | null;

  readonly issues:
    readonly EngineeringValidityIssue[];
}