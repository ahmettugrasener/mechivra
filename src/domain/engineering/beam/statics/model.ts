import type {
  EngineeringModel,
  EngineeringResult,
  EngineeringValidityIssue,
} from "@/domain/engineering/contracts";

import {
  createInvalidEngineeringResult,
  createValidEngineeringResult,
} from "@/domain/engineering/model";

import {
  SIMPLY_SUPPORTED_BEAM_STATE_VERSION,
  SIMPLY_SUPPORTED_BEAM_TYPE,
} from "@/domain/engineering/beam/types";

import type {
  SimplySupportedBeamState,
} from "@/domain/engineering/beam/types";

import {
  validateSimplySupportedBeamStateInput,
} from "@/domain/engineering/beam/state";

import {
  BEAM_STATICS_MODEL_ID,
  BEAM_STATICS_MODEL_VERSION,
} from "@/domain/engineering/beam/statics/types";

import type {
  BeamShearEvaluationSide,
  BeamStaticsValues,
} from "@/domain/engineering/beam/statics/types";

const BEAM_STATICS_ASSUMPTIONS = [
  "beam-statics.two-dimensional",
  "beam-statics.simply-supported",
  "beam-statics.pin-left-roller-right",
  "beam-statics.single-downward-point-load",
  "beam-statics.statically-determinate",
  "beam-statics.beam-self-weight-neglected",
] as const;

function validateBeamStaticsState(
  state: SimplySupportedBeamState,
): readonly EngineeringValidityIssue[] {
  const issues: EngineeringValidityIssue[] = [
    ...validateSimplySupportedBeamStateInput({
      spanM: state.spanM,
      pointLoadN:
        state.pointLoadN,
      loadPositionM:
        state.loadPositionM,
    }),
  ];

  if (
    state.type !==
    SIMPLY_SUPPORTED_BEAM_TYPE
  ) {
    issues.push({
      code:
        "unsupported_beam_type",

      field: "type",

      messageKey:
        "engineering.beam.validation.unsupportedBeamType",
    });
  }

  if (
    state.stateVersion !==
    SIMPLY_SUPPORTED_BEAM_STATE_VERSION
  ) {
    issues.push({
      code:
        "unsupported_beam_state_version",

      field:
        "stateVersion",

      messageKey:
        "engineering.beam.validation.unsupportedStateVersion",
    });
  }

  if (
    state.supportConfiguration !==
    "pin_left_roller_right"
  ) {
    issues.push({
      code:
        "unsupported_support_configuration",

      field:
        "supportConfiguration",

      messageKey:
        "engineering.beam.validation.unsupportedSupportConfiguration",
    });
  }

  if (
    state.coordinateOrigin !==
    "left_support"
  ) {
    issues.push({
      code:
        "unsupported_coordinate_origin",

      field:
        "coordinateOrigin",

      messageKey:
        "engineering.beam.validation.unsupportedCoordinateOrigin",
    });
  }

  if (
    state.positiveXDirection !==
    "left_to_right"
  ) {
    issues.push({
      code:
        "unsupported_coordinate_direction",

      field:
        "positiveXDirection",

      messageKey:
        "engineering.beam.validation.unsupportedCoordinateDirection",
    });
  }

  if (
    state.pointLoadDirection !==
    "downward"
  ) {
    issues.push({
      code:
        "unsupported_load_direction",

      field:
        "pointLoadDirection",

      messageKey:
        "engineering.beam.validation.unsupportedLoadDirection",
    });
  }

  return issues;
}

function canonicalizeZero(
  value: number,
): number {
  return Object.is(
    value,
    -0,
  )
    ? 0
    : value;
}

function calculateBeamStaticsValues(
  state: SimplySupportedBeamState,
): BeamStaticsValues {
  const {
    spanM,
    pointLoadN,
    loadPositionM,
  } = state;

  const distanceToRightSupportM =
    spanM - loadPositionM;

  const leftReactionN =
    canonicalizeZero(
      pointLoadN *
        distanceToRightSupportM /
        spanM,
    );

  const rightReactionN =
    canonicalizeZero(
      pointLoadN *
        loadPositionM /
        spanM,
    );

  const leftOfLoadN =
    canonicalizeZero(
      leftReactionN,
    );

  const rightOfLoadN =
    canonicalizeZero(
      leftReactionN -
        pointLoadN,
    );

  const loadJumpN =
    canonicalizeZero(
      -pointLoadN,
    );

  const maximumMomentNm =
    canonicalizeZero(
      leftReactionN *
        loadPositionM,
    );

  const maximumMomentLocation =
    pointLoadN === 0
      ? {
          type:
            "interval" as const,

          xStartM: 0,
          xEndM: spanM,
        }
      : {
          type:
            "point" as const,

          xM: loadPositionM,
        };

  return {
    spanM,
    pointLoadN,
    loadPositionM,

    leftReactionN,
    rightReactionN,

    shear: {
      leftOfLoadN,
      rightOfLoadN,
      loadJumpN,

      segments: [
        {
          xStartM: 0,
          xEndM:
            loadPositionM,
          valueN:
            leftOfLoadN,
        },

        {
          xStartM:
            loadPositionM,
          xEndM: spanM,
          valueN:
            rightOfLoadN,
        },
      ],
    },

    moment: {
      segments: [
        {
          xStartM: 0,
          xEndM:
            loadPositionM,

          slopeN:
            leftReactionN,

          interceptNm: 0,
        },

        {
          xStartM:
            loadPositionM,
          xEndM: spanM,

          slopeN:
            canonicalizeZero(
              leftReactionN -
                pointLoadN,
            ),

          interceptNm:
            canonicalizeZero(
              pointLoadN *
                loadPositionM,
            ),
        },
      ],

      maximum: {
        valueNm:
          maximumMomentNm,

        location:
          maximumMomentLocation,
      },
    },
  };
}

export const beamStaticsModel: EngineeringModel<
  SimplySupportedBeamState,
  BeamStaticsValues
> = {
  id:
    BEAM_STATICS_MODEL_ID,

  version:
    BEAM_STATICS_MODEL_VERSION,

  evaluate(
    state,
  ): EngineeringResult<BeamStaticsValues> {
    const issues =
      validateBeamStaticsState(
        state,
      );

    if (
      issues.length > 0
    ) {
      return createInvalidEngineeringResult<
        BeamStaticsValues
      >({
        modelId:
          BEAM_STATICS_MODEL_ID,

        modelVersion:
          BEAM_STATICS_MODEL_VERSION,

        assumptions:
          BEAM_STATICS_ASSUMPTIONS,

        issues,
      });
    }

    const values =
      calculateBeamStaticsValues(
        state,
      );

    return createValidEngineeringResult({
      modelId:
        BEAM_STATICS_MODEL_ID,

      modelVersion:
        BEAM_STATICS_MODEL_VERSION,

      values,

      assumptions:
        BEAM_STATICS_ASSUMPTIONS,
    });
  },
};

function assertValidBeamPosition(
  values: BeamStaticsValues,
  xM: number,
): void {
  if (
    !Number.isFinite(xM)
  ) {
    throw new RangeError(
      "Beam position must be finite.",
    );
  }

  if (
    xM < 0 ||
    xM > values.spanM
  ) {
    throw new RangeError(
      `Beam position must satisfy 0 <= x <= ${values.spanM}.`,
    );
  }
}

/**
 * Evaluates the internal shear force at x.
 *
 * At discontinuities the caller must choose which
 * side of the point is required:
 *
 * x = 0:
 *   left  -> 0
 *   right -> RA
 *
 * x = a:
 *   left  -> RA
 *   right -> RA - P
 *
 * x = L:
 *   left  -> RA - P
 *   right -> 0
 */
export function evaluateBeamShearN(
  values: BeamStaticsValues,
  xM: number,
  side:
    BeamShearEvaluationSide =
      "right",
): number {
  assertValidBeamPosition(
    values,
    xM,
  );

  if (xM === 0) {
    return side === "left"
      ? 0
      : canonicalizeZero(
          values.leftReactionN,
        );
  }

  if (
    xM ===
    values.loadPositionM
  ) {
    return side === "left"
      ? canonicalizeZero(
          values.shear
            .leftOfLoadN,
        )
      : canonicalizeZero(
          values.shear
            .rightOfLoadN,
        );
  }

  if (
    xM === values.spanM
  ) {
    return side === "left"
      ? canonicalizeZero(
          values.shear
            .rightOfLoadN,
        )
      : 0;
  }

  if (
    xM <
    values.loadPositionM
  ) {
    return canonicalizeZero(
      values.shear
        .leftOfLoadN,
    );
  }

  return canonicalizeZero(
    values.shear
      .rightOfLoadN,
  );
}

/**
 * Evaluates the bending moment at x.
 *
 * The moment is continuous at the point load for
 * this beam model.
 */
export function evaluateBeamMomentNm(
  values: BeamStaticsValues,
  xM: number,
): number {
  assertValidBeamPosition(
    values,
    xM,
  );

  if (
    xM <=
    values.loadPositionM
  ) {
    return canonicalizeZero(
      values.leftReactionN *
        xM,
    );
  }

  return canonicalizeZero(
    values.leftReactionN *
      xM -
      values.pointLoadN *
        (
          xM -
          values.loadPositionM
        ),
  );
}