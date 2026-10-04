import type {
  EngineeringValidityIssue,
} from "@/domain/engineering/contracts";

import {
  collectValidityIssues,
  validateExclusiveRange,
  validateGreaterThan,
  validateGreaterThanOrEqual,
} from "@/domain/engineering/model";

import {
  SIMPLY_SUPPORTED_BEAM_STATE_VERSION,
  SIMPLY_SUPPORTED_BEAM_TYPE,
} from "@/domain/engineering/beam/types";

import type {
  BeamStateCreationResult,
  SimplySupportedBeamState,
  SimplySupportedBeamStateInput,
} from "@/domain/engineering/beam/types";

export function validateSimplySupportedBeamStateInput(
  input: SimplySupportedBeamStateInput,
): readonly EngineeringValidityIssue[] {
  const spanIssue =
    validateGreaterThan(
      "spanM",
      input.spanM,
      0,
    );

  const loadIssue =
    validateGreaterThanOrEqual(
      "pointLoadN",
      input.pointLoadN,
      0,
    );

  /**
   * The load-position range depends on span.
   *
   * If span itself is invalid, we do not add a
   * second potentially misleading range issue.
   */
  const positionIssue =
    spanIssue === null
      ? validateExclusiveRange(
          "loadPositionM",
          input.loadPositionM,
          0,
          input.spanM,
        )
      : null;

  return collectValidityIssues([
    spanIssue,
    loadIssue,
    positionIssue,
  ]);
}

export function createSimplySupportedBeamState(
  input: SimplySupportedBeamStateInput,
): BeamStateCreationResult {
  const issues =
    validateSimplySupportedBeamStateInput(
      input,
    );

  if (issues.length > 0) {
    return {
      state: null,
      issues,
    };
  }

  const state: SimplySupportedBeamState = {
    type:
      SIMPLY_SUPPORTED_BEAM_TYPE,

    stateVersion:
      SIMPLY_SUPPORTED_BEAM_STATE_VERSION,

    supportConfiguration:
      "pin_left_roller_right",

    coordinateOrigin:
      "left_support",

    positiveXDirection:
      "left_to_right",

    pointLoadDirection:
      "downward",

    spanM: input.spanM,
    pointLoadN:
      input.pointLoadN,
    loadPositionM:
      input.loadPositionM,
  };

  return {
    state:
      Object.freeze(state),

    issues: [],
  };
}