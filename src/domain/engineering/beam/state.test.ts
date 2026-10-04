import {
  describe,
  expect,
  it,
} from "vitest";

import {
  createSimplySupportedBeamState,
  SIMPLY_SUPPORTED_BEAM_STATE_VERSION,
  SIMPLY_SUPPORTED_BEAM_TYPE,
  validateSimplySupportedBeamStateInput,
} from "@/domain/engineering";

describe(
  "Simply supported beam shared state",
  () => {
    it(
      "creates a canonical valid beam state",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 10_000,
            loadPositionM: 2,
          });

        expect(
          result.issues,
        ).toEqual([]);

        expect(
          result.state,
        ).not.toBeNull();

        expect(
          result.state,
        ).toEqual({
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

          spanM: 4,
          pointLoadN: 10_000,
          loadPositionM: 2,
        });
      },
    );

    it(
      "accepts zero point load",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 0,
            loadPositionM: 2,
          });

        expect(
          result.state,
        ).not.toBeNull();

        expect(
          result.issues,
        ).toEqual([]);
      },
    );

    it(
      "rejects a non-positive span",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 0,
            pointLoadN: 10_000,
            loadPositionM: 0,
          });

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues.some(
            (issue) =>
              issue.field ===
              "spanM",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a negative point load magnitude",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: -1,
            loadPositionM: 2,
          });

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues.some(
            (issue) =>
              issue.field ===
              "pointLoadN",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a point load exactly at the left support",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 10_000,
            loadPositionM: 0,
          });

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues.some(
            (issue) =>
              issue.field ===
              "loadPositionM",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a point load exactly at the right support",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 10_000,
            loadPositionM: 4,
          });

        expect(
          result.state,
        ).toBeNull();

        expect(
          result.issues.some(
            (issue) =>
              issue.field ===
              "loadPositionM",
          ),
        ).toBe(true);
      },
    );

    it(
      "rejects a load position outside the beam",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 10_000,
            loadPositionM: 5,
          });

        expect(
          result.state,
        ).toBeNull();
      },
    );

    it(
      "rejects non-finite beam inputs",
      () => {
        const issues =
          validateSimplySupportedBeamStateInput(
            {
              spanM:
                Number.POSITIVE_INFINITY,

              pointLoadN:
                Number.NaN,

              loadPositionM: 2,
            },
          );

        expect(
          issues.some(
            (issue) =>
              issue.field ===
              "spanM" &&
              issue.code ===
                "not_finite",
          ),
        ).toBe(true);

        expect(
          issues.some(
            (issue) =>
              issue.field ===
              "pointLoadN" &&
              issue.code ===
                "not_finite",
          ),
        ).toBe(true);
      },
    );

    it(
      "creates an immutable state object",
      () => {
        const result =
          createSimplySupportedBeamState({
            spanM: 4,
            pointLoadN: 10_000,
            loadPositionM: 2,
          });

        expect(
          result.state,
        ).not.toBeNull();

        expect(
          Object.isFrozen(
            result.state,
          ),
        ).toBe(true);
      },
    );
  },
);