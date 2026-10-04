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

describe(
  "Beam statics zero-load behavior",
  () => {
    it(
      "produces zero reactions, shear, and moment everywhere for zero load",
      () => {
        const stateResult =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 0,
            loadPositionM: 2,
          });

        if (!stateResult.state) {
          throw new Error(
            "Expected zero-load beam state to remain valid.",
          );
        }

        const result =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        if (!result.values) {
          throw new Error(
            "Expected zero-load statics values.",
          );
        }

        const values =
          result.values;

        expect(
          values.leftReactionN,
        ).toBe(0);

        expect(
          values.rightReactionN,
        ).toBe(0);

        expect(
          values.shear
            .leftOfLoadN,
        ).toBe(0);

        expect(
          values.shear
            .rightOfLoadN,
        ).toBe(0);

        expect(
          values.shear
            .loadJumpN,
        ).toBe(0);

        const samplePositions = [
          0,
          0.5,
          1,
          2,
          3,
          3.5,
          4,
        ];

        for (
          const xM
          of samplePositions
        ) {
          expect(
            evaluateBeamMomentNm(
              values,
              xM,
            ),
          ).toBe(0);
        }

        expect(
          evaluateBeamShearN(
            values,
            1,
          ),
        ).toBe(0);

        expect(
          evaluateBeamShearN(
            values,
            3,
          ),
        ).toBe(0);

        expect(
          values.moment.maximum
            .valueNm,
        ).toBe(0);

        expect(
          values.moment.maximum
            .location,
        ).toEqual({
          type: "interval",
          xStartM: 0,
          xEndM: 4,
        });
      },
    );
  },
);