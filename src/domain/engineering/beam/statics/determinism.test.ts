import {
  describe,
  expect,
  it,
} from "vitest";

import {
  beamStaticsModel,
  createSimplySupportedBeamState,
} from "@/domain/engineering";

describe(
  "Beam statics determinism",
  () => {
    it(
      "produces exactly the same result for repeated evaluation of the same canonical state",
      () => {
        const stateResult =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 10_000,
            loadPositionM: 1.25,
          });

        if (!stateResult.state) {
          throw new Error(
            "Expected a valid beam state.",
          );
        }

        const first =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        const second =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        const third =
          beamStaticsModel.evaluate(
            stateResult.state,
          );

        expect(
          second,
        ).toEqual(first);

        expect(
          third,
        ).toEqual(first);
      },
    );

    it(
      "does not mutate the canonical beam state during evaluation",
      () => {
        const stateResult =
          createSimplySupportedBeamState({
            spanM: 6,
            pointLoadN: 12_000,
            loadPositionM: 2.25,
          });

        if (!stateResult.state) {
          throw new Error(
            "Expected a valid beam state.",
          );
        }

        const before =
          JSON.stringify(
            stateResult.state,
          );

        beamStaticsModel.evaluate(
          stateResult.state,
        );

        const after =
          JSON.stringify(
            stateResult.state,
          );

        expect(after).toBe(
          before,
        );

        expect(
          Object.isFrozen(
            stateResult.state,
          ),
        ).toBe(true);
      },
    );
  },
);