import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamStaticsModel,
  createSimplySupportedBeamState,
  evaluateBeamMomentNm,
} from "@/domain/engineering";

import {
  beamStaticsReferenceCases,
  isWithinReferenceTolerance,
} from "@/reference/engineering/beam-statics";

import type {
  BeamStaticsReferenceCase,
  ReferenceTolerance,
} from "@/reference/engineering/beam-statics";

import type {
  BeamStaticsValues,
} from "@/domain/engineering";

function evaluateReferenceCase(
  referenceCase: BeamStaticsReferenceCase,
): BeamStaticsValues {
  const stateResult =
    createSimplySupportedBeamState({
      spanM:
        referenceCase.input
          .spanM,

      pointLoadN:
        referenceCase.input
          .pointLoadN,

      loadPositionM:
        referenceCase.input
          .loadPositionM,
    });

  if (!stateResult.state) {
    throw new Error(
      `Reference case ${referenceCase.id} did not create a valid beam state.`,
    );
  }

  const modelResult =
    beamStaticsModel.evaluate(
      stateResult.state,
    );

  if (!modelResult.values) {
    throw new Error(
      `Reference case ${referenceCase.id} did not produce statics values.`,
    );
  }

  return modelResult.values;
}

function expectWithinTolerance(
  actual: number,
  expected: number,
  tolerance: ReferenceTolerance,
): void {
  expect(
    isWithinReferenceTolerance(
      actual,
      expected,
      tolerance,
    ),
  ).toBe(true);
}

describe(
  "Beam statics independent reference verification",
  () => {
    it.each(
      beamStaticsReferenceCases,
    )(
      "matches reference reactions for $id",
      (
        referenceCase,
      ) => {
        const values =
          evaluateReferenceCase(
            referenceCase,
          );

        expectWithinTolerance(
          values.leftReactionN,
          referenceCase.expected
            .leftReactionN,
          referenceCase.tolerance,
        );

        expectWithinTolerance(
          values.rightReactionN,
          referenceCase.expected
            .rightReactionN,
          referenceCase.tolerance,
        );
      },
    );

    it.each(
      beamStaticsReferenceCases,
    )(
      "matches reference maximum moment for $id",
      (
        referenceCase,
      ) => {
        const values =
          evaluateReferenceCase(
            referenceCase,
          );

        expectWithinTolerance(
          values.moment.maximum
            .valueNm,
          referenceCase.expected
            .maximumMomentNm,
          referenceCase.tolerance,
        );

        expect(
          values.moment.maximum
            .location.type,
        ).toBe("point");

        if (
          values.moment.maximum
            .location.type !==
          "point"
        ) {
          throw new Error(
            `Reference case ${referenceCase.id} expected a unique maximum-moment point.`,
          );
        }

        expectWithinTolerance(
          values.moment.maximum
            .location.xM,
          referenceCase.expected
            .maximumMomentPositionM,
          referenceCase.tolerance,
        );
      },
    );

    it.each(
      beamStaticsReferenceCases.filter(
        (referenceCase) =>
          referenceCase.expected
            .shear !==
          undefined,
      ),
    )(
      "matches reference shear values for $id",
      (
        referenceCase,
      ) => {
        const values =
          evaluateReferenceCase(
            referenceCase,
          );

        const expectedShear =
          referenceCase.expected
            .shear;

        if (!expectedShear) {
          throw new Error(
            `Reference case ${referenceCase.id} has no shear reference.`,
          );
        }

        expectWithinTolerance(
          values.shear
            .leftOfLoadN,
          expectedShear
            .leftOfLoadN,
          referenceCase.tolerance,
        );

        expectWithinTolerance(
          values.shear
            .rightOfLoadN,
          expectedShear
            .rightOfLoadN,
          referenceCase.tolerance,
        );
      },
    );

    it.each(
      beamStaticsReferenceCases.filter(
        (referenceCase) =>
          referenceCase.expected
            .momentPoints !==
          undefined,
      ),
    )(
      "matches reference moment points for $id",
      (
        referenceCase,
      ) => {
        const values =
          evaluateReferenceCase(
            referenceCase,
          );

        const momentPoints =
          referenceCase.expected
            .momentPoints;

        if (!momentPoints) {
          throw new Error(
            `Reference case ${referenceCase.id} has no moment-point references.`,
          );
        }

        for (
          const point
          of momentPoints
        ) {
          const actualMoment =
            evaluateBeamMomentNm(
              values,
              point.xM,
            );

          expectWithinTolerance(
            actualMoment,
            point.expectedMomentNm,
            referenceCase.tolerance,
          );
        }
      },
    );
  },
);