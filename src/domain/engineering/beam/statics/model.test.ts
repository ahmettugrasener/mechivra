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
  SimplySupportedBeamState,
} from "@/domain/engineering";

function createRequiredBeamState(
  spanM: number,
  pointLoadN: number,
  loadPositionM: number,
): SimplySupportedBeamState {
  const result =
    createSimplySupportedBeamState({
      spanM,
      pointLoadN,
      loadPositionM,
    });

  if (!result.state) {
    throw new Error(
      "Expected a valid beam state.",
    );
  }

  return result.state;
}

describe(
  "Simply supported beam statics model",
  () => {
    it(
      "calculates symmetric reactions for a centered point load",
      () => {
        const state =
          createRequiredBeamState(
            4,
            10_000,
            2,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        expect(
          result.status,
        ).toBe("valid");

        expect(
          result.values,
        ).not.toBeNull();

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        expect(
          result.values
            .leftReactionN,
        ).toBeCloseTo(
          5000,
          12,
        );

        expect(
          result.values
            .rightReactionN,
        ).toBeCloseTo(
          5000,
          12,
        );
      },
    );

    it(
      "calculates asymmetric reactions for an eccentric point load",
      () => {
        const state =
          createRequiredBeamState(
            4,
            10_000,
            1,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        expect(
          result.values,
        ).not.toBeNull();

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        expect(
          result.values
            .leftReactionN,
        ).toBeCloseTo(
          7500,
          12,
        );

        expect(
          result.values
            .rightReactionN,
        ).toBeCloseTo(
          2500,
          12,
        );
      },
    );

    it(
      "creates the expected shear jump at the point load",
      () => {
        const state =
          createRequiredBeamState(
            4,
            10_000,
            2,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        expect(
          result.values.shear
            .leftOfLoadN,
        ).toBeCloseTo(
          5000,
          12,
        );

        expect(
          result.values.shear
            .rightOfLoadN,
        ).toBeCloseTo(
          -5000,
          12,
        );

        expect(
          result.values.shear
            .loadJumpN,
        ).toBeCloseTo(
          -10_000,
          12,
        );
      },
    );

    it(
      "evaluates shear on both sides of the point load",
      () => {
        const state =
          createRequiredBeamState(
            4,
            10_000,
            2,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        expect(
          evaluateBeamShearN(
            result.values,
            2,
            "left",
          ),
        ).toBeCloseTo(
          5000,
          12,
        );

        expect(
          evaluateBeamShearN(
            result.values,
            2,
            "right",
          ),
        ).toBeCloseTo(
          -5000,
          12,
        );
      },
    );

    it(
      "evaluates a continuous moment diagram",
      () => {
        const state =
          createRequiredBeamState(
            4,
            10_000,
            2,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        expect(
          evaluateBeamMomentNm(
            result.values,
            0,
          ),
        ).toBeCloseTo(
          0,
          12,
        );

        expect(
          evaluateBeamMomentNm(
            result.values,
            2,
          ),
        ).toBeCloseTo(
          10_000,
          12,
        );

        expect(
          evaluateBeamMomentNm(
            result.values,
            4,
          ),
        ).toBeCloseTo(
          0,
          12,
        );
      },
    );

    it(
      "reports the maximum moment at the load position for a positive point load",
      () => {
        const state =
          createRequiredBeamState(
            4,
            10_000,
            1,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        expect(
          result.values.moment
            .maximum.valueNm,
        ).toBeCloseTo(
          7500,
          12,
        );

        expect(
          result.values.moment
            .maximum.location,
        ).toEqual({
          type: "point",
          xM: 1,
        });
      },
    );

    it(
      "represents zero-load maximum moment as non-unique over the beam",
      () => {
        const state =
          createRequiredBeamState(
            4,
            0,
            2,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        expect(
          result.values
            .leftReactionN,
        ).toBe(0);

        expect(
          result.values
            .rightReactionN,
        ).toBe(0);

        expect(
          result.values.moment
            .maximum.valueNm,
        ).toBe(0);

        expect(
          result.values.moment
            .maximum.location,
        ).toEqual({
          type: "interval",
          xStartM: 0,
          xEndM: 4,
        });
      },
    );

    it(
      "returns no calculated values for an invalid beam state",
      () => {
        const validState =
          createRequiredBeamState(
            4,
            10_000,
            2,
          );

        const invalidState: SimplySupportedBeamState = {
          ...validState,
          spanM: 0,
        };

        const result =
          beamStaticsModel.evaluate(
            invalidState,
          );

        expect(
          result.status,
        ).toBe("invalid");

        expect(
          result.values,
        ).toBeNull();

        expect(
          result.validity
            .withinDomain,
        ).toBe(false);

        expect(
          result.validity.issues.some(
            (issue) =>
              issue.field ===
              "spanM",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects diagram evaluation outside the beam",
      () => {
        const state =
          createRequiredBeamState(
            4,
            10_000,
            2,
          );

        const result =
          beamStaticsModel.evaluate(
            state,
          );

        if (!result.values) {
          throw new Error(
            "Expected valid beam statics values.",
          );
        }

        const values =
          result.values;

        expect(
          () =>
            evaluateBeamMomentNm(
              values,
              -0.1,
            ),
        ).toThrow(
          RangeError,
        );

        expect(
          () =>
            evaluateBeamShearN(
              values,
              4.1,
            ),
        ).toThrow(
          RangeError,
        );
      },
    );
  },
);