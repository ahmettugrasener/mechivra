import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamStaticsModel,
  createSimplySupportedBeamState,
  evaluateBeamMomentNm,
  evaluateBeamShearN,
} from "@/domain/engineering";

import type {
  BeamStaticsValues,
} from "@/domain/engineering";

function evaluateValidBeam(
  spanM: number,
  pointLoadN: number,
  loadPositionM: number,
): BeamStaticsValues {
  const stateResult =
    createSimplySupportedBeamState({
      spanM,
      pointLoadN,
      loadPositionM,
    });

  if (!stateResult.state) {
    throw new Error(
      "Expected a valid beam state.",
    );
  }

  const result =
    beamStaticsModel.evaluate(
      stateResult.state,
    );

  if (!result.values) {
    throw new Error(
      "Expected valid beam statics values.",
    );
  }

  return result.values;
}

function evaluateMomentSegment(
  slopeN: number,
  interceptNm: number,
  xM: number,
): number {
  return (
    slopeN *
      xM +
    interceptNm
  );
}

describe(
  "Beam statics physical properties",
  () => {
    it(
      "satisfies vertical-force equilibrium across a grid of valid beam states",
      () => {
        const spans = [
          1,
          2.5,
          4,
          10,
        ];

        const loads = [
          0,
          1,
          1_000,
          12_500,
        ];

        const positionFractions = [
          0.1,
          0.25,
          0.5,
          0.75,
          0.9,
        ];

        for (
          const spanM
          of spans
        ) {
          for (
            const pointLoadN
            of loads
          ) {
            for (
              const fraction
              of positionFractions
            ) {
              const loadPositionM =
                spanM *
                fraction;

              const values =
                evaluateValidBeam(
                  spanM,
                  pointLoadN,
                  loadPositionM,
                );

              expect(
                values.leftReactionN +
                  values.rightReactionN,
              ).toBeCloseTo(
                pointLoadN,
                10,
              );
            }
          }
        }
      },
    );

    it(
      "swaps support reactions when the load position is mirrored",
      () => {
        const spanM = 8;
        const pointLoadN =
          12_000;

        const positions = [
          0.8,
          1.6,
          2.8,
        ];

        for (
          const loadPositionM
          of positions
        ) {
          const original =
            evaluateValidBeam(
              spanM,
              pointLoadN,
              loadPositionM,
            );

          const mirrored =
            evaluateValidBeam(
              spanM,
              pointLoadN,
              spanM -
                loadPositionM,
            );

          expect(
            original.leftReactionN,
          ).toBeCloseTo(
            mirrored.rightReactionN,
            10,
          );

          expect(
            original.rightReactionN,
          ).toBeCloseTo(
            mirrored.leftReactionN,
            10,
          );

          expect(
            original.moment.maximum
              .valueNm,
          ).toBeCloseTo(
            mirrored.moment.maximum
              .valueNm,
            10,
          );
        }
      },
    );

    it(
      "scales reactions and moment linearly with point-load magnitude",
      () => {
        const base =
          evaluateValidBeam(
            5,
            3_000,
            1.7,
          );

        const scales = [
          0.5,
          2,
          10,
        ];

        for (
          const scale
          of scales
        ) {
          const scaled =
            evaluateValidBeam(
              5,
              3_000 *
                scale,
              1.7,
            );

          expect(
            scaled.leftReactionN,
          ).toBeCloseTo(
            base.leftReactionN *
              scale,
            10,
          );

          expect(
            scaled.rightReactionN,
          ).toBeCloseTo(
            base.rightReactionN *
              scale,
            10,
          );

          expect(
            scaled.moment.maximum
              .valueNm,
          ).toBeCloseTo(
            base.moment.maximum
              .valueNm *
              scale,
            10,
          );
        }
      },
    );

    it(
      "preserves reactions and scales moment with geometrically similar beam length",
      () => {
        const base =
          evaluateValidBeam(
            4,
            10_000,
            1,
          );

        const scales = [
          0.5,
          2,
          5,
        ];

        for (
          const scale
          of scales
        ) {
          const scaled =
            evaluateValidBeam(
              4 *
                scale,
              10_000,
              1 *
                scale,
            );

          expect(
            scaled.leftReactionN,
          ).toBeCloseTo(
            base.leftReactionN,
            10,
          );

          expect(
            scaled.rightReactionN,
          ).toBeCloseTo(
            base.rightReactionN,
            10,
          );

          expect(
            scaled.moment.maximum
              .valueNm,
          ).toBeCloseTo(
            base.moment.maximum
              .valueNm *
              scale,
            10,
          );
        }
      },
    );

    it(
      "approaches the expected support-reaction limits as the load approaches the left support",
      () => {
        const spanM = 4;
        const pointLoadN =
          10_000;

        const nearLeft =
          evaluateValidBeam(
            spanM,
            pointLoadN,
            1e-6,
          );

        expect(
          nearLeft.leftReactionN,
        ).toBeGreaterThan(
          pointLoadN *
            0.999999,
        );

        expect(
          nearLeft.rightReactionN,
        ).toBeLessThan(0.01);

        expect(
          nearLeft.moment.maximum
            .valueNm,
        ).toBeLessThan(0.011);
      },
    );

    it(
      "approaches the expected support-reaction limits as the load approaches the right support",
      () => {
        const spanM = 4;
        const pointLoadN =
          10_000;

        const nearRight =
          evaluateValidBeam(
            spanM,
            pointLoadN,
            spanM -
              1e-6,
          );

        expect(
          nearRight.rightReactionN,
        ).toBeGreaterThan(
          pointLoadN *
            0.999999,
        );

        expect(
          nearRight.leftReactionN,
        ).toBeLessThan(0.01);

        expect(
          nearRight.moment.maximum
            .valueNm,
        ).toBeLessThan(0.011);
      },
    );

    it(
      "keeps bending moment continuous at the point load",
      () => {
        const cases = [
          {
            spanM: 4,
            loadN: 10_000,
            positionM: 2,
          },
          {
            spanM: 4,
            loadN: 10_000,
            positionM: 1,
          },
          {
            spanM: 7.5,
            loadN: 2_750,
            positionM: 5.1,
          },
        ] as const;

        for (
          const testCase
          of cases
        ) {
          const values =
            evaluateValidBeam(
              testCase.spanM,
              testCase.loadN,
              testCase.positionM,
            );

          const [
            leftSegment,
            rightSegment,
          ] =
            values.moment
              .segments;

          if (
            !leftSegment ||
            !rightSegment
          ) {
            throw new Error(
              "Expected two moment segments.",
            );
          }

          const leftMoment =
            evaluateMomentSegment(
              leftSegment.slopeN,
              leftSegment.interceptNm,
              testCase.positionM,
            );

          const rightMoment =
            evaluateMomentSegment(
              rightSegment.slopeN,
              rightSegment.interceptNm,
              testCase.positionM,
            );

          expect(
            leftMoment,
          ).toBeCloseTo(
            rightMoment,
            10,
          );

          expect(
            leftMoment,
          ).toBeCloseTo(
            values.moment.maximum
              .valueNm,
            10,
          );
        }
      },
    );

    it(
      "produces a shear jump equal to the negative point-load magnitude",
      () => {
        const cases = [
          {
            spanM: 4,
            loadN: 10_000,
            positionM: 2,
          },
          {
            spanM: 6,
            loadN: 7_250,
            positionM: 1.5,
          },
          {
            spanM: 3,
            loadN: 500,
            positionM: 2.7,
          },
        ] as const;

        for (
          const testCase
          of cases
        ) {
          const values =
            evaluateValidBeam(
              testCase.spanM,
              testCase.loadN,
              testCase.positionM,
            );

          expect(
            values.shear
              .rightOfLoadN -
              values.shear
                .leftOfLoadN,
          ).toBeCloseTo(
            -testCase.loadN,
            10,
          );

          expect(
            values.shear
              .loadJumpN,
          ).toBeCloseTo(
            -testCase.loadN,
            10,
          );
        }
      },
    );

    it(
      "returns zero bending moment at both simple supports",
      () => {
        const cases = [
          {
            spanM: 4,
            loadN: 10_000,
            positionM: 2,
          },
          {
            spanM: 5,
            loadN: 8_000,
            positionM: 1,
          },
          {
            spanM: 7,
            loadN: 3_250,
            positionM: 6,
          },
        ] as const;

        for (
          const testCase
          of cases
        ) {
          const values =
            evaluateValidBeam(
              testCase.spanM,
              testCase.loadN,
              testCase.positionM,
            );

          expect(
            evaluateBeamMomentNm(
              values,
              0,
            ),
          ).toBeCloseTo(
            0,
            10,
          );

          expect(
            evaluateBeamMomentNm(
              values,
              testCase.spanM,
            ),
          ).toBeCloseTo(
            0,
            10,
          );
        }
      },
    );

    it(
      "represents shear correctly immediately outside the supported span",
      () => {
        const values =
          evaluateValidBeam(
            4,
            10_000,
            2,
          );

        expect(
          evaluateBeamShearN(
            values,
            0,
            "left",
          ),
        ).toBe(0);

        expect(
          evaluateBeamShearN(
            values,
            0,
            "right",
          ),
        ).toBeCloseTo(
          5_000,
          10,
        );

        expect(
          evaluateBeamShearN(
            values,
            4,
            "left",
          ),
        ).toBeCloseTo(
          -5_000,
          10,
        );

        expect(
          evaluateBeamShearN(
            values,
            4,
            "right",
          ),
        ).toBe(0);
      },
    );
  },
);